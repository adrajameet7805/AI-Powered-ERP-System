from flask import request, jsonify
from database import db
from routes.auth import token_required

def validate_required(data, required_fields):
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return f"Missing required fields: {', '.join(missing)}"
    return None

def create_crud_routes(bp, model, route_name):
    @bp.route(f'/{route_name}', methods=['GET'], endpoint=f'get_all_{route_name}')
    @token_required()
    def get_all():
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 50, type=int)
            search = request.args.get('search', '', type=str)
            
            query = model.query
            
            # Generic search across string columns
            if search:
                from sqlalchemy import or_
                string_cols = [c for c in model.__table__.columns
                               if str(c.type) in ('VARCHAR', 'TEXT')]
                if string_cols:
                    query = query.filter(or_(*[c.ilike(f'%{search}%')
                                               for c in string_cols]))
            
            paginated = query.order_by(model.id.desc()).paginate(
                page=page, per_page=per_page, error_out=False)
            
            return jsonify({
                "data": [item.to_dict() for item in paginated.items],
                "total": paginated.total,
                "page": page,
                "pages": paginated.pages,
                "per_page": per_page
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.route(f'/{route_name}', methods=['POST'], endpoint=f'create_{route_name}')
    @token_required()
    def create():
        try:
            import datetime
            data = request.json
            
            required_fields = model.REQUIRED_FIELDS if hasattr(model, 'REQUIRED_FIELDS') else []
            error_msg = validate_required(data, required_fields)
            if error_msg:
                return jsonify({"error": error_msg}), 400
                
            # Parse dates for SQLite
            for key, value in list(data.items()):
                if hasattr(model, key):
                    col = getattr(model, key)
                    if hasattr(col, 'type') and type(col.type).__name__ == 'Date':
                        if value:
                            if "T" in value:
                                value = value.split("T")[0]
                            data[key] = datetime.datetime.strptime(value, '%Y-%m-%d').date()
                        else:
                            data[key] = None

            item = model(**data)
            db.session.add(item)
            db.session.commit()
            return jsonify(item.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    @bp.route(f'/{route_name}/<int:id>', methods=['DELETE'], endpoint=f'delete_{route_name}')
    @token_required()
    def delete(id):
        try:
            item = model.query.get(id)
            if not item:
                return jsonify({"error": "Not found"}), 404
            db.session.delete(item)
            db.session.commit()
            return jsonify({"message": "Deleted"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    @bp.route(f'/{route_name}/<int:id>', methods=['PUT'], endpoint=f'update_{route_name}')
    @token_required()
    def update(id):
        try:
            import datetime
            item = model.query.get(id)
            if not item:
                return jsonify({"error": "Not found"}), 404
            data = request.json
            
            required_fields = model.REQUIRED_FIELDS if hasattr(model, 'REQUIRED_FIELDS') else []
            error_msg = validate_required(data, required_fields)
            if error_msg:
                return jsonify({"error": error_msg}), 400
                
            # Parse date fields same as in create
            for key, value in list(data.items()):
                if hasattr(model, key) and key != 'id':
                    col = getattr(model, key)
                    if hasattr(col, 'type') and type(col.type).__name__ == 'Date':
                        if value:
                            if "T" in value:
                                value = value.split("T")[0]
                            data[key] = datetime.datetime.strptime(value,'%Y-%m-%d').date()
                        else:
                            data[key] = None
                    setattr(item, key, data[key])
            db.session.commit()
            return jsonify(item.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

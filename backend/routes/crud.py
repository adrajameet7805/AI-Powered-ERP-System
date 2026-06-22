from flask import request, jsonify
from database import db
from routes.auth import token_required

def create_crud_routes(bp, model, route_name):
    @bp.route(f'/{route_name}', methods=['GET'], endpoint=f'get_all_{route_name}')
    @token_required()
    def get_all():
        try:
            items = model.query.all()
            return jsonify([item.to_dict() for item in items]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.route(f'/{route_name}', methods=['POST'], endpoint=f'create_{route_name}')
    @token_required()
    def create():
        try:
            import datetime
            data = request.json
            
            # Parse dates for SQLite
            for key, value in list(data.items()):
                if hasattr(model, key):
                    col = getattr(model, key)
                    if hasattr(col, 'type') and type(col.type).__name__ == 'Date':
                        if value:
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
            data = request.json
            item = model.query.get(id)
            if not item:
                return jsonify({"error": "Not found"}), 404
                
            for key, value in data.items():
                if hasattr(model, key):
                    col = getattr(model, key)
                    if hasattr(col, 'type') and type(col.type).__name__ == 'Date':
                        if value:
                            setattr(item, key, datetime.datetime.strptime(value, '%Y-%m-%d').date())
                        else:
                            setattr(item, key, None)
                    else:
                        setattr(item, key, value)
                        
            db.session.commit()
            return jsonify(item.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

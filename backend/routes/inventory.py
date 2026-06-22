from flask import Blueprint, jsonify, request
from database import db
from models.product import Product
from routes.auth import token_required

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
@token_required()
def get_inventory():
    return jsonify([
        {"id": 1, "sku": "SKU-100", "quantity": 150},
        {"id": 2, "sku": "SKU-200", "quantity": 30}
    ])

@inventory_bp.route('/products', methods=['GET'])
@token_required()
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@inventory_bp.route('/products', methods=['POST'])
@token_required()
def create_product():
    data = request.json
    try:
        required_fields = Product.REQUIRED_FIELDS if hasattr(Product, 'REQUIRED_FIELDS') else []
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
            
        new_product = Product(
            sku=data.get('sku'),
            name=data.get('name'),
            category=data.get('category'),
            unit_price=data.get('unit_price', 0),
            cost_price=data.get('cost_price', 0),
            reorder_level=data.get('reorder_level', 10),
            current_stock=data.get('current_stock', 0),
            status=data.get('status', 'active')
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@inventory_bp.route('/products/<int:id>', methods=['DELETE'])
@token_required()
def delete_product(id):
    try:
        item = Product.query.get(id)
        if not item:
            return jsonify({"error": "Not found"}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@inventory_bp.route('/products/<int:id>', methods=['PUT'])
@token_required()
def update_product(id):
    data = request.json
    try:
        item = Product.query.get(id)
        if not item:
            return jsonify({"error": "Not found"}), 404
            
        required_fields = Product.REQUIRED_FIELDS if hasattr(Product, 'REQUIRED_FIELDS') else []
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
            
        item.sku = data.get('sku', item.sku)
        item.name = data.get('name', item.name)
        item.category = data.get('category', item.category)
        item.unit_price = data.get('unit_price', item.unit_price)
        item.cost_price = data.get('cost_price', item.cost_price)
        item.reorder_level = data.get('reorder_level', item.reorder_level)
        item.current_stock = data.get('current_stock', item.current_stock)
        item.status = data.get('status', item.status)
        
        db.session.commit()
        return jsonify(item.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

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

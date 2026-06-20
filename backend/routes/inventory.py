from flask import Blueprint, jsonify

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
def get_inventory():
    return jsonify([
        {"id": 1, "sku": "SKU-100", "quantity": 150},
        {"id": 2, "sku": "SKU-200", "quantity": 30}
    ])

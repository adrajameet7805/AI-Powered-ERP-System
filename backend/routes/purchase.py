from flask import Blueprint, jsonify, request
from database import db
from routes.crud import create_crud_routes
from models.purchase import Supplier, PurchaseOrder
from routes.auth import token_required

purchase_bp = Blueprint('purchase', __name__)

create_crud_routes(purchase_bp, Supplier, 'suppliers', roles=["Admin", "Manager"])
create_crud_routes(purchase_bp, PurchaseOrder, 'purchase_orders', roles=["Admin", "Manager"])

@purchase_bp.route('/purchase_orders/<int:id>/approve', methods=['PATCH'])
@token_required(roles=["Admin"])
def approve_purchase_order(id):
    po = PurchaseOrder.query.get(id)
    if not po:
        return jsonify({"error": "Not found"}), 404
    po.status = "approved"
    db.session.commit()

    from models.notification import Notification
    notif = Notification(
        recipient_role="Manager",
        title=f"Purchase Order PO-{id:04d} approved",
        message=f"Admin has approved your purchase order. It is now sent to supplier.",
        type="purchase",
        related_id=id,
        related_type="purchase_order"
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify(po.to_dict()), 200

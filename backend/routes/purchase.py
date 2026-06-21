from flask import Blueprint
from routes.crud import create_crud_routes
from models.purchase import Supplier, PurchaseOrder

purchase_bp = Blueprint('purchase', __name__)

create_crud_routes(purchase_bp, Supplier, 'suppliers')
create_crud_routes(purchase_bp, PurchaseOrder, 'purchase_orders')

from flask import Blueprint
from routes.crud import create_crud_routes
from models.inventory_models import Warehouse, StockMovement

inventory_ext_bp = Blueprint('inventory_ext', __name__)

create_crud_routes(inventory_ext_bp, Warehouse, 'warehouses')
create_crud_routes(inventory_ext_bp, StockMovement, 'stock_movements')

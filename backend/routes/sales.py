from flask import Blueprint
from routes.crud import create_crud_routes
from models.sales import SalesOrder, Invoice

sales_bp = Blueprint('sales', __name__)

create_crud_routes(sales_bp, SalesOrder, 'sales_orders', roles=["Admin", "Manager"])
create_crud_routes(sales_bp, Invoice, 'invoices', roles=["Admin", "Manager"])

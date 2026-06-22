from flask import Blueprint
from routes.crud import create_crud_routes
from models.crm import Customer, Lead

crm_bp = Blueprint('crm', __name__)

create_crud_routes(crm_bp, Customer, 'customers', roles=["Admin", "Manager"])
create_crud_routes(crm_bp, Lead, 'leads', roles=["Admin", "Manager"])

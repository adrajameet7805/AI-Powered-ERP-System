from flask import Blueprint
from routes.crud import create_crud_routes
from models.accounting import Account, Transaction, Expense

accounting_bp = Blueprint('accounting', __name__)

create_crud_routes(accounting_bp, Account, 'accounts', roles=["Admin"])
create_crud_routes(accounting_bp, Transaction, 'transactions', roles=["Admin"])
create_crud_routes(accounting_bp, Expense, 'expenses', roles=["Admin"])

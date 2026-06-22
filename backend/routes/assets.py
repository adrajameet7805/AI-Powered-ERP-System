from flask import Blueprint
from routes.crud import create_crud_routes
from models.assets import Asset

assets_bp = Blueprint('assets', __name__)

create_crud_routes(assets_bp, Asset, 'assets', roles=["Admin", "Manager"])

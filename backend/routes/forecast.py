from flask import Blueprint, jsonify
from database import db
from models.product import Product
from models.inventory_models import StockMovement
from ai_service.forecaster import analyze_inventory
from datetime import datetime, timedelta
import random
from routes.auth import token_required

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/', methods=['GET'])
@token_required()
def get_forecast():
    try:
        products = Product.query.all()
        products_data = [p.to_dict() for p in products]
        
        # Build mock sales history for the ML models
        # (In a real scenario, this would group actual past sales_orders / stock_movements)
        sales_history = {}
        for p in products_data:
            sku = p['sku']
            history = []
            # Generate 90 days of random historical data for training
            base_demand = random.randint(2, 20)
            for i in range(90, 0, -1):
                date_str = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
                # Add some noise to the data
                noise = random.randint(-2, 5)
                y = max(0, base_demand + noise)
                history.append({'ds': date_str, 'y': y})
            sales_history[sku] = history
            
        result = analyze_inventory(products_data, sales_history)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

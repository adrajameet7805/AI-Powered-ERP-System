from flask import Blueprint, jsonify
from database import db
from models.product import Product
from models.inventory_models import StockMovement, ForecastLog
from ai_service.forecaster import analyze_inventory
from sqlalchemy import func
from datetime import datetime
from routes.auth import token_required

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/', methods=['GET'])
@token_required(roles=["Admin", "Manager"])
def get_forecast():
    try:
        products = Product.query.all()
        products_data = [p.to_dict() for p in products]
        
        sales_history = {}
        for p in products:
            # Query actual stock movements (outward) grouped by date
            movements = db.session.query(
                func.date(StockMovement.created_at).label('ds'),
                func.sum(StockMovement.quantity).label('y')
            ).filter(
                StockMovement.product_id == p.id,
                StockMovement.movement_type == 'out'
            ).group_by(
                func.date(StockMovement.created_at)
            ).order_by('ds').all()
            
            history = [{'ds': str(m.ds), 'y': int(m.y)} for m in movements]
            sales_history[p.sku] = history
            
        result = analyze_inventory(products_data, sales_history)
        
        # Override reasoning if history is less than 14 days
        urgent_count = 0
        for insight in result['sku_insights']:
            sku = insight['sku']
            history_len = len(sales_history.get(sku, []))
            if history_len == 0:
                insight['reasoning'] = "Insufficient sales history — add stock movement data for AI forecasting."
                insight['recommendation'] = "unknown"
                insight['forecast30d'] = 0
                insight['suggestedOrderQty'] = 0
            elif history_len < 14:
                insight['reasoning'] = f"Insufficient history ({history_len} days)."
                insight['recommendation'] = "unknown"
                insight['forecast30d'] = 0
                insight['suggestedOrderQty'] = 0
            elif insight['recommendation'] == "reorder_urgent":
                urgent_count += 1
                
        # Store forecast run in logs
        log = ForecastLog(
            products_analyzed=len(products_data),
            urgent_count=urgent_count
        )
        db.session.add(log)
        db.session.commit()
        
        return jsonify(result), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

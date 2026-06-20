from flask import Blueprint, jsonify

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/', methods=['GET'])
def get_forecast():
    return jsonify({
        "demand": 450,
        "reorder_quantity": 200,
        "insights": "Demand is expected to rise by 15% next month."
    })

from flask import Blueprint, jsonify
from database import db
from sqlalchemy import text, func
import datetime

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/kpis', methods=['GET'])
def get_kpis():
    try:
        from models.crm import Customer
        from models.product import Product
        from models.hr import Employee
        from models.sales import Invoice

        total_customers = db.session.query(func.count(Customer.id)).scalar() or 0
        total_products = db.session.query(func.count(Product.id)).scalar() or 0
        total_employees = db.session.query(func.count(Employee.id)).scalar() or 0
        total_revenue = db.session.query(func.sum(Invoice.amount)).scalar() or 0

        return jsonify({
            "total_revenue": float(total_revenue),
            "total_customers": total_customers,
            "total_products": total_products,
            "total_employees": total_employees,
            "revenue_change_pct": 12.5,
            "customer_change_pct": 8.2
        }), 200
    except Exception as e:
        return jsonify({
            "total_revenue": 0, "total_customers": 0,
            "total_products": 0, "total_employees": 0,
            "revenue_change_pct": 0, "customer_change_pct": 0
        }), 200

@dashboard_bp.route('/revenue-chart', methods=['GET'])
def get_revenue_chart():
    months = []
    today = datetime.date.today()
    for i in range(5, -1, -1):
        month = today.replace(day=1) - datetime.timedelta(days=i*30)
        months.append({
            "month": month.strftime("%b"),
            "revenue": round(40000 + (i * 5000) + (i % 3 * 2000), 2),
            "profit": round(15000 + (i * 2000) + (i % 2 * 1000), 2)
        })
    return jsonify(months), 200

@dashboard_bp.route('/inventory-chart', methods=['GET'])
def get_inventory_chart():
    weeks = []
    for i in range(5, -1, -1):
        weeks.append({
            "week": f"W{6-i}",
            "stock_in": 80 + (i * 10),
            "stock_out": 60 + (i * 8)
        })
    return jsonify(weeks), 200

@dashboard_bp.route('/activity-feed', methods=['GET'])
def get_activity_feed():
    activities = []
    try:
        from models.sales import SalesOrder
        from models.hr import LeaveRequest
        from models.purchase import PurchaseOrder

        orders = SalesOrder.query.order_by(
            SalesOrder.id.desc()).limit(3).all()
        for o in orders:
            activities.append({
                "who": f"Order #{o.id}",
                "what": "Sales order created",
                "when": str(o.order_date) if hasattr(o, 'order_date') else "recently",
                "tag": "Sales"
            })

        leaves = LeaveRequest.query.order_by(
            LeaveRequest.id.desc()).limit(2).all()
        for l in leaves:
            activities.append({
                "who": f"Employee #{l.employee_id}",
                "what": f"Leave request — {l.status}",
                "when": str(l.start_date) if hasattr(l, 'start_date') else "recently",
                "tag": "HR"
            })
    except Exception:
        pass

    if not activities:
        activities = [
            {"who": "System", "what": "ERP system started",
             "when": "today", "tag": "System"},
            {"who": "Admin", "what": "Initial setup complete",
             "when": "today", "tag": "System"}
        ]
    return jsonify(activities[:5]), 200

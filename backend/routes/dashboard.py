from flask import Blueprint, jsonify
from database import db
from sqlalchemy import func, extract
from models.crm import Customer
from models.hr import Employee
from models.product import Product
from models.sales import Invoice, SalesOrder
from models.purchase import PurchaseOrder
from models.hr import LeaveRequest
from models.inventory_models import StockMovement, ForecastLog
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from routes.auth import token_required

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/kpis', methods=['GET'])
@token_required()
def get_kpis():
    try:
        now = datetime.utcnow()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        prev_month_start = current_month_start - relativedelta(months=1)
        
        # Revenue
        total_revenue = db.session.query(func.sum(Invoice.amount)).scalar() or 0
        curr_revenue = db.session.query(func.sum(Invoice.amount)).filter(Invoice.created_at >= current_month_start).scalar() or 0
        prev_revenue = db.session.query(func.sum(Invoice.amount)).filter(Invoice.created_at >= prev_month_start, Invoice.created_at < current_month_start).scalar() or 0
        revenue_change_pct = ((curr_revenue - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else (100 if curr_revenue > 0 else 0)

        # Customers
        total_customers = Customer.query.count()
        curr_customers = Customer.query.filter(Customer.created_at >= current_month_start).count()
        prev_customers = Customer.query.filter(Customer.created_at >= prev_month_start, Customer.created_at < current_month_start).count()
        customer_change_pct = ((curr_customers - prev_customers) / prev_customers * 100) if prev_customers > 0 else (100 if curr_customers > 0 else 0)

        total_products = Product.query.count()
        total_employees = Employee.query.count()

        return jsonify({
            "total_revenue": float(total_revenue),
            "total_customers": total_customers,
            "total_products": total_products,
            "total_employees": total_employees,
            "revenue_change_pct": round(revenue_change_pct, 1),
            "customer_change_pct": round(customer_change_pct, 1)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@dashboard_bp.route('/revenue-chart', methods=['GET'])
@token_required()
def get_revenue_chart():
    try:
        now = datetime.utcnow()
        results = []
        for i in range(5, -1, -1):
            target_month = now - relativedelta(months=i)
            start_date = target_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = start_date + relativedelta(months=1)
            
            revenue = db.session.query(func.sum(Invoice.amount)).filter(Invoice.created_at >= start_date, Invoice.created_at < end_date).scalar() or 0
            revenue = float(revenue)
            profit = revenue * 0.35
            
            results.append({
                "month": start_date.strftime("%b"),
                "revenue": revenue,
                "profit": profit
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@dashboard_bp.route('/inventory-chart', methods=['GET'])
@token_required()
def get_inventory_chart():
    try:
        now = datetime.utcnow()
        results = []
        for i in range(5, -1, -1):
            start_date = now - timedelta(days=now.weekday() + (i * 7)) # Start of week i weeks ago
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = start_date + timedelta(days=7)
            
            stock_in = db.session.query(func.sum(StockMovement.quantity)).filter(
                StockMovement.movement_type == 'in',
                StockMovement.created_at >= start_date,
                StockMovement.created_at < end_date
            ).scalar() or 0
            
            stock_out = db.session.query(func.sum(StockMovement.quantity)).filter(
                StockMovement.movement_type == 'out',
                StockMovement.created_at >= start_date,
                StockMovement.created_at < end_date
            ).scalar() or 0
            
            results.append({
                "week": f"Wk {6-i}",
                "in": int(stock_in),
                "out": int(stock_out)
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@dashboard_bp.route('/activity-feed', methods=['GET'])
@token_required()
def get_activity_feed():
    try:
        activities = []
        
        # Recent Sales
        sales = SalesOrder.query.order_by(SalesOrder.created_at.desc()).limit(10).all()
        for s in sales:
            activities.append({
                "who": s.customer.name if s.customer else "Unknown",
                "what": f"Placed sales order for ${s.total_amount}",
                "when": s.created_at.isoformat() if s.created_at else "",
                "created_at": s.created_at,
                "tag": "Sales"
            })
            
        # Recent Purchases
        purchases = PurchaseOrder.query.order_by(PurchaseOrder.created_at.desc()).limit(10).all()
        for p in purchases:
            activities.append({
                "who": p.supplier.name if p.supplier else "Unknown",
                "what": f"Purchase order created for ${p.total_amount}",
                "when": p.created_at.isoformat() if p.created_at else "",
                "created_at": p.created_at,
                "tag": "Purchase"
            })
            
        # Recent Leaves
        leaves = LeaveRequest.query.order_by(LeaveRequest.created_at.desc()).limit(10).all()
        for l in leaves:
            activities.append({
                "who": l.employee.full_name if l.employee else "Unknown",
                "what": f"Requested {l.leave_type} leave ({l.status})",
                "when": l.created_at.isoformat() if l.created_at else "",
                "created_at": l.created_at,
                "tag": "HR"
            })
            
        # Recent AI Forecasts
        forecasts = ForecastLog.query.order_by(ForecastLog.timestamp.desc()).limit(10).all()
        for f in forecasts:
            activities.append({
                "who": "AI Insight",
                "what": f"Analyzed {f.products_analyzed} products. {f.urgent_count} urgent reorders detected.",
                "when": f.timestamp.isoformat() if f.timestamp else "",
                "created_at": f.timestamp,
                "tag": "AI"
            })
            
        # Sort combined by date descending
        activities.sort(key=lambda x: x["created_at"] or datetime.min, reverse=True)
        
        # Format 'when' nicely
        now = datetime.utcnow()
        for a in activities:
            if a["created_at"]:
                diff = now - a["created_at"]
                if diff.days > 0:
                    a["when"] = f"{diff.days} days ago"
                elif diff.seconds // 3600 > 0:
                    a["when"] = f"{diff.seconds // 3600} hours ago"
                elif diff.seconds // 60 > 0:
                    a["when"] = f"{diff.seconds // 60} mins ago"
                else:
                    a["when"] = "Just now"
            del a["created_at"]
            
        return jsonify(activities[:10]), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

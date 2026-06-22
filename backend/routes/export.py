from flask import Blueprint, jsonify, send_file
import pandas as pd
import io
import os
from database import db
from models.crm import Customer, Lead
from models.sales import SalesOrder, Invoice
from models.inventory_models import Warehouse, StockMovement
from models.product import Product
from models.hr import Employee
from models.accounting import Account
from routes.auth import token_required

export_bp = Blueprint('export', __name__)

def generate_excel(query_model, filename):
    data = [item.to_dict() for item in query_model.query.all()]
    if not data:
        return jsonify({"error": "No data found"}), 404
        
    df = pd.DataFrame(data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Sheet1')
    
    output.seek(0)
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name=filename
    )

def generate_pdf(title, data, filename):
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    
    output = io.BytesIO()
    c = canvas.Canvas(output, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, title)
    
    c.setFont("Helvetica", 10)
    y_position = height - 80
    
    for row in data:
        text = " | ".join([f"{k}: {v}" for k, v in row.items() if str(v)])
        # Simple wrapping
        c.drawString(50, y_position, text[:100] + ('...' if len(text) > 100 else ''))
        y_position -= 15
        
        if y_position < 50:
            c.showPage()
            c.setFont("Helvetica", 10)
            y_position = height - 50
            
    c.save()
    output.seek(0)
    
    return send_file(
        output,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )

@export_bp.route('/excel/<module>', methods=['GET'])
@token_required(roles=["Admin", "Manager"])
def export_excel(module):
    model_map = {
        'inventory': Product,
        'crm': Customer,
        'hrms': Employee,
        'accounting': Account
    }
    
    if module not in model_map:
        return jsonify({"error": "Invalid module for excel export"}), 400
        
    return generate_excel(model_map[module], f"{module}_export.xlsx")

@export_bp.route('/pdf/<module>', methods=['GET'])
@token_required(roles=["Admin", "Manager"])
def export_pdf(module):
    model_map = {
        'sales': SalesOrder,
        'inventory': Product,
        'financials': Account
    }
    
    if module not in model_map:
        return jsonify({"error": "Invalid module for pdf export"}), 400
        
    data = [item.to_dict() for item in model_map[module].query.all()]
    if not data:
         return jsonify({"error": "No data found"}), 404
         
    return generate_pdf(f"{module.capitalize()} Report", data, f"{module}_report.pdf")

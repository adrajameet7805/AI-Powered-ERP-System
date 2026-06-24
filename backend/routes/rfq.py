from flask import Blueprint, request, jsonify
from database import db
from models.rfq import RFQ, RFQItem, RFQVendor, VendorQuotation
from models.rfq import VendorQuotationItem, GSTInvoice, ActivityLog
from routes.auth import token_required
from models.user import User
from config import Config
import jwt
import datetime
import random

rfq_bp = Blueprint('rfq', __name__)

def get_current_user(req):
    token = None
    if 'Authorization' in req.headers:
        token = req.headers['Authorization'].split(" ")[1]
    if token:
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            return User.query.filter_by(email=data['sub']).first()
        except:
            pass
    return None

def log_action(actor_id, actor_email, entity_type, entity_id, action, meta=None):
    log = ActivityLog(
        actor_id=actor_id,
        actor_email=actor_email,
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        meta_data=str(meta) if meta else None,
    )
    db.session.add(log)

# ── RFQs ──────────────────────────────────────────────────

@rfq_bp.route('/rfqs', methods=['GET'])
@token_required(roles=['Admin', 'Manager'])
def get_rfqs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    search = request.args.get('search', '')
    status = request.args.get('status', '')

    query = RFQ.query
    if search:
        query = query.filter(RFQ.title.ilike(f'%{search}%'))
    if status:
        query = query.filter(RFQ.status == status)

    paginated = query.order_by(RFQ.id.desc()).paginate(
        page=page, per_page=per_page, error_out=False)
    return jsonify({
        'data': [r.to_dict() for r in paginated.items],
        'total': paginated.total,
        'page': page,
        'pages': paginated.pages,
        'per_page': per_page,
    }), 200

@rfq_bp.route('/rfqs', methods=['POST'])
@token_required(roles=['Admin', 'Manager'])
def create_rfq():
    try:
        data = request.json
        if not data.get('title') or not data.get('deadline'):
            return jsonify({'error': 'title and deadline are required'}), 400

        user = get_current_user(request)
        created_by_id = user.id if user else None

        rfq = RFQ(
            title=data['title'],
            description=data.get('description'),
            deadline=datetime.datetime.strptime(
                data['deadline'], '%Y-%m-%d').date(),
            status=data.get('status', 'draft'),
            created_by=created_by_id,
        )
        db.session.add(rfq)
        db.session.flush()

        # Add items
        for item in data.get('items', []):
            rfq_item = RFQItem(
                rfq_id=rfq.id,
                description=item['description'],
                quantity=item.get('quantity', 1),
                unit=item.get('unit', 'units'),
                estimated_price=item.get('estimated_price'),
            )
            db.session.add(rfq_item)

        # Assign vendors
        for vendor_id in data.get('vendor_ids', []):
            rv = RFQVendor(rfq_id=rfq.id, vendor_id=int(vendor_id))
            db.session.add(rv)

        log_action(created_by_id, user.email if user else None, 'RFQ', rfq.id, 'Created RFQ', {'title': rfq.title})
        db.session.commit()
        return jsonify(rfq.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@rfq_bp.route('/rfqs/<int:id>', methods=['GET'])
@token_required(roles=['Admin', 'Manager', 'Employee'])
def get_rfq(id):
    rfq = RFQ.query.get(id)
    if not rfq:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(rfq.to_dict()), 200

@rfq_bp.route('/rfqs/<int:id>', methods=['PUT'])
@token_required(roles=['Admin', 'Manager'])
def update_rfq(id):
    rfq = RFQ.query.get(id)
    if not rfq:
        return jsonify({'error': 'Not found'}), 404
    data = request.json
    for field in ['title', 'description', 'status']:
        if field in data:
            setattr(rfq, field, data[field])
    if 'deadline' in data and data['deadline']:
        rfq.deadline = datetime.datetime.strptime(
            data['deadline'], '%Y-%m-%d').date()
    
    user = get_current_user(request)
    log_action(user.id if user else None, user.email if user else None, 'RFQ', rfq.id, f'Updated RFQ status to {rfq.status}' if 'status' in data else 'Updated RFQ')
    db.session.commit()
    return jsonify(rfq.to_dict()), 200

@rfq_bp.route('/rfqs/<int:id>', methods=['DELETE'])
@token_required(roles=['Admin'])
def delete_rfq(id):
    rfq = RFQ.query.get(id)
    if not rfq:
        return jsonify({'error': 'Not found'}), 404
    
    user = get_current_user(request)
    log_action(user.id if user else None, user.email if user else None, 'RFQ', id, 'Deleted RFQ')
    
    db.session.delete(rfq)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200

# ── VENDOR QUOTATIONS ─────────────────────────────────────

@rfq_bp.route('/rfqs/<int:rfq_id>/quotations', methods=['GET'])
@token_required(roles=['Admin', 'Manager'])
def get_rfq_quotations(rfq_id):
    quotations = VendorQuotation.query.filter_by(rfq_id=rfq_id).all()
    return jsonify([q.to_dict() for q in quotations]), 200

@rfq_bp.route('/vendor-quotations', methods=['POST'])
@token_required(roles=['Admin', 'Manager', 'Employee'])
def submit_quotation():
    try:
        data = request.json
        required = ['rfq_id', 'vendor_id', 'total_price', 'delivery_days']
        missing = [f for f in required if not data.get(f)]
        if missing:
            return jsonify({'error': f'Missing: {", ".join(missing)}'}), 400

        q = VendorQuotation(
            rfq_id=data['rfq_id'],
            vendor_id=data['vendor_id'],
            total_price=data['total_price'],
            delivery_days=data['delivery_days'],
            notes=data.get('notes'),
            status='submitted',
            submitted_at=datetime.datetime.utcnow(),
        )
        db.session.add(q)
        db.session.flush()

        for item in data.get('items', []):
            qi = VendorQuotationItem(
                quotation_id=q.id,
                rfq_item_id=item['rfq_item_id'],
                unit_price=item['unit_price'],
                total_price=item['total_price'],
                notes=item.get('notes'),
            )
            db.session.add(qi)

        user = get_current_user(request)
        log_action(user.id if user else None, user.email if user else None, 'VendorQuotation', q.id, 'Submitted quotation')
        db.session.commit()
        return jsonify(q.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@rfq_bp.route('/vendor-quotations/<int:id>/select', methods=['PATCH'])
@token_required(roles=['Admin', 'Manager'])
def select_quotation(id):
    q = VendorQuotation.query.get(id)
    if not q:
        return jsonify({'error': 'Not found'}), 404

    # Reject all other quotations for this RFQ
    VendorQuotation.query.filter(
        VendorQuotation.rfq_id == q.rfq_id,
        VendorQuotation.id != id
    ).update({'status': 'rejected'})

    q.status = 'selected'
    
    # Also update the RFQ's status to 'awarded'
    if q.rfq:
        q.rfq.status = 'awarded'

    # Auto-generate a PurchaseOrder
    from models.purchase import PurchaseOrder
    import random
    po = PurchaseOrder(
        supplier_id=q.vendor_id,
        order_date=datetime.date.today(),
        status='approved',
        total_amount=q.total_price,
        notes=f'Auto-generated from RFQ quotation #{id}',
    )
    db.session.add(po)
    db.session.flush()
    
    po_number = f"PO-{po.id:04d}"

    user = get_current_user(request)
    log_action(user.id if user else None, user.email if user else None, 'VendorQuotation', id, 'Selected winning quotation')
    log_action(user.id if user else None, user.email if user else None, 'PurchaseOrder', po.id, 'Auto-generated Purchase Order from RFQ quotation')
    
    db.session.commit()
    return jsonify({
        'quotation': q.to_dict(),
        'purchase_order_id': po.id,
        'po_number': po_number,
    }), 200

# ── GST INVOICES ──────────────────────────────────────────

@rfq_bp.route('/gst-invoices', methods=['GET'])
@token_required(roles=['Admin', 'Manager'])
def get_gst_invoices():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    paginated = GSTInvoice.query.order_by(GSTInvoice.id.desc()).paginate(
        page=page, per_page=per_page, error_out=False)
    return jsonify({
        'data': [i.to_dict() for i in paginated.items],
        'total': paginated.total,
        'page': page,
        'pages': paginated.pages,
        'per_page': per_page,
    }), 200

@rfq_bp.route('/gst-invoices', methods=['POST'])
@token_required(roles=['Admin', 'Manager'])
def create_gst_invoice():
    try:
        data = request.json
        subtotal = float(data.get('subtotal', 0))
        is_interstate = data.get('is_interstate', False)

        if is_interstate:
            igst = round(subtotal * 0.18, 2)
            cgst = sgst = 0
        else:
            cgst = round(subtotal * 0.09, 2)
            sgst = round(subtotal * 0.09, 2)
            igst = 0

        total = subtotal + cgst + sgst + igst

        import random
        inv_number = data.get('invoice_number') or \
            f"INV-{datetime.date.today().year}-{random.randint(10000,99999)}"

        inv = GSTInvoice(
            po_id=data.get('po_id'),
            invoice_number=inv_number,
            subtotal=subtotal,
            cgst=cgst,
            sgst=sgst,
            igst=igst,
            total_amount=total,
            status=data.get('status', 'draft'),
            due_date=datetime.datetime.strptime(
                data['due_date'], '%Y-%m-%d').date()
                if data.get('due_date') else None,
        )
        db.session.add(inv)
        
        user = get_current_user(request)
        log_action(user.id if user else None, user.email if user else None, 'GSTInvoice', inv.id, 'Generated GST invoice')
        
        db.session.commit()
        return jsonify(inv.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@rfq_bp.route('/gst-invoices/<int:id>/pay', methods=['PATCH'])
@token_required(roles=['Admin'])
def mark_invoice_paid(id):
    inv = GSTInvoice.query.get(id)
    if not inv:
        return jsonify({'error': 'Not found'}), 404
    inv.status = 'paid'
    inv.paid_at = datetime.datetime.utcnow()
    
    user = get_current_user(request)
    log_action(user.id if user else None, user.email if user else None, 'GSTInvoice', id, 'Marked invoice as paid')
    
    db.session.commit()
    return jsonify(inv.to_dict()), 200

@rfq_bp.route('/gst-invoices/<int:id>', methods=['DELETE'])
@token_required(roles=['Admin'])
def delete_gst_invoice(id):
    inv = GSTInvoice.query.get(id)
    if not inv:
        return jsonify({'error': 'Not found'}), 404
    
    user = get_current_user(request)
    log_action(user.id if user else None, user.email if user else None, 'GSTInvoice', id, 'Deleted GST invoice')
    
    db.session.delete(inv)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200

# ── ACTIVITY LOG ──────────────────────────────────────────

@rfq_bp.route('/activity-logs', methods=['GET'])
@token_required(roles=['Admin', 'Manager'])
def get_activity_logs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    entity_type = request.args.get('entity_type', '')
    
    query = ActivityLog.query
    if entity_type:
        query = query.filter(ActivityLog.entity_type == entity_type)

    paginated = query.order_by(
        ActivityLog.id.desc()).paginate(
        page=page, per_page=per_page, error_out=False)
    return jsonify({
        'data': [l.to_dict() for l in paginated.items],
        'total': paginated.total,
        'page': page,
        'pages': paginated.pages,
        'per_page': per_page,
    }), 200

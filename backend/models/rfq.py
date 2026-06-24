from database import db
import datetime

class RFQ(db.Model):
    __tablename__ = 'rfqs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    deadline = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), default='draft')
    # status values: draft, published, closed, awarded, cancelled
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(),
                           onupdate=db.func.now())

    items = db.relationship('RFQItem', backref='rfq',
                            cascade='all, delete-orphan')
    rfq_vendors = db.relationship('RFQVendor', backref='rfq',
                                  cascade='all, delete-orphan')
    quotations = db.relationship('VendorQuotation', backref='rfq')

    REQUIRED_FIELDS = ['title', 'deadline']

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'deadline': str(self.deadline) if self.deadline else None,
            'status': self.status,
            'created_by': self.created_by,
            'created_at': str(self.created_at) if self.created_at else None,
            'items': [i.to_dict() for i in self.items],
            'vendor_count': len(self.rfq_vendors),
            'quotation_count': len(self.quotations),
        }

class RFQItem(db.Model):
    __tablename__ = 'rfq_items'
    id = db.Column(db.Integer, primary_key=True)
    rfq_id = db.Column(db.Integer, db.ForeignKey('rfqs.id'), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=False)
    unit = db.Column(db.String(50), default='units')
    estimated_price = db.Column(db.Numeric(15, 2))

    def to_dict(self):
        return {
            'id': self.id,
            'rfq_id': self.rfq_id,
            'description': self.description,
            'quantity': float(self.quantity) if self.quantity else 0,
            'unit': self.unit,
            'estimated_price': float(self.estimated_price)
                               if self.estimated_price else None,
        }

class RFQVendor(db.Model):
    __tablename__ = 'rfq_vendors'
    id = db.Column(db.Integer, primary_key=True)
    rfq_id = db.Column(db.Integer, db.ForeignKey('rfqs.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'),
                          nullable=False)
    invited_at = db.Column(db.DateTime, server_default=db.func.now())
    responded_at = db.Column(db.DateTime)

    vendor = db.relationship('Supplier')

    def to_dict(self):
        return {
            'id': self.id,
            'rfq_id': self.rfq_id,
            'vendor_id': self.vendor_id,
            'vendor_name': self.vendor.name if self.vendor else None,
            'invited_at': str(self.invited_at) if self.invited_at else None,
            'responded_at': str(self.responded_at)
                            if self.responded_at else None,
        }

class VendorQuotation(db.Model):
    __tablename__ = 'vendor_quotations'
    id = db.Column(db.Integer, primary_key=True)
    rfq_id = db.Column(db.Integer, db.ForeignKey('rfqs.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'),
                          nullable=False)
    total_price = db.Column(db.Numeric(15, 2), nullable=False)
    delivery_days = db.Column(db.Integer, nullable=False)
    valid_until = db.Column(db.Date)
    notes = db.Column(db.Text)
    status = db.Column(db.String(50), default='draft')
    # status: draft, submitted, under_review, selected, rejected
    submitted_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    vendor = db.relationship('Supplier')
    items = db.relationship('VendorQuotationItem', backref='quotation',
                            cascade='all, delete-orphan')

    REQUIRED_FIELDS = ['rfq_id', 'vendor_id', 'total_price', 'delivery_days']

    def to_dict(self):
        return {
            'id': self.id,
            'rfq_id': self.rfq_id,
            'vendor_id': self.vendor_id,
            'vendor_name': self.vendor.name if self.vendor else None,
            'total_price': float(self.total_price) if self.total_price else 0,
            'delivery_days': self.delivery_days,
            'valid_until': str(self.valid_until) if self.valid_until else None,
            'notes': self.notes,
            'status': self.status,
            'submitted_at': str(self.submitted_at)
                            if self.submitted_at else None,
            'items': [i.to_dict() for i in self.items],
        }

class VendorQuotationItem(db.Model):
    __tablename__ = 'vendor_quotation_items'
    id = db.Column(db.Integer, primary_key=True)
    quotation_id = db.Column(db.Integer,
                              db.ForeignKey('vendor_quotations.id'),
                              nullable=False)
    rfq_item_id = db.Column(db.Integer, db.ForeignKey('rfq_items.id'),
                             nullable=False)
    unit_price = db.Column(db.Numeric(15, 2), nullable=False)
    total_price = db.Column(db.Numeric(15, 2), nullable=False)
    notes = db.Column(db.String(500))

    rfq_item = db.relationship('RFQItem')

    def to_dict(self):
        return {
            'id': self.id,
            'quotation_id': self.quotation_id,
            'rfq_item_id': self.rfq_item_id,
            'rfq_item_description': self.rfq_item.description
                                    if self.rfq_item else '',
            'unit_price': float(self.unit_price) if self.unit_price else 0,
            'total_price': float(self.total_price) if self.total_price else 0,
            'notes': self.notes,
        }

class GSTInvoice(db.Model):
    __tablename__ = 'gst_invoices'
    id = db.Column(db.Integer, primary_key=True)
    po_id = db.Column(db.Integer,
                      db.ForeignKey('purchase_orders.id'),
                      nullable=False)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False)
    cgst = db.Column(db.Numeric(15, 2), default=0.00)
    sgst = db.Column(db.Numeric(15, 2), default=0.00)
    igst = db.Column(db.Numeric(15, 2), default=0.00)
    total_amount = db.Column(db.Numeric(15, 2), nullable=False)
    status = db.Column(db.String(50), default='draft')
    # status: draft, sent, acknowledged, paid, overdue, cancelled
    due_date = db.Column(db.Date)
    paid_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    REQUIRED_FIELDS = ['po_id', 'invoice_number', 'subtotal', 'total_amount']

    def to_dict(self):
        return {
            'id': self.id,
            'po_id': self.po_id,
            'invoice_number': self.invoice_number,
            'subtotal': float(self.subtotal) if self.subtotal else 0,
            'cgst': float(self.cgst) if self.cgst else 0,
            'sgst': float(self.sgst) if self.sgst else 0,
            'igst': float(self.igst) if self.igst else 0,
            'total_amount': float(self.total_amount)
                            if self.total_amount else 0,
            'status': self.status,
            'due_date': str(self.due_date) if self.due_date else None,
            'paid_at': str(self.paid_at) if self.paid_at else None,
            'created_at': str(self.created_at) if self.created_at else None,
        }

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    actor_email = db.Column(db.String(120))
    entity_type = db.Column(db.String(50))
    entity_id = db.Column(db.Integer)
    action = db.Column(db.String(100))
    meta_data = db.Column('metadata', db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'actor_email': self.actor_email,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'action': self.action,
            'metadata': self.meta_data,
            'created_at': str(self.created_at) if self.created_at else None,
        }

from database import db

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    REQUIRED_FIELDS = ['name']
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    address = db.Column(db.Text)
    rating = db.Column(db.Numeric(3, 2), default=4.00)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # New fields
    gst_number = db.Column(db.String(20), unique=True)
    vendor_status = db.Column(db.String(50), default='active')
    # status values: active, inactive, blacklisted, pending_approval
    location = db.Column(db.String(100), default='India')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "rating": float(self.rating) if self.rating else 0,
            "created_at": str(self.created_at) if self.created_at else None,
            "gst_number": self.gst_number,
            "vendor_status": self.vendor_status,
            "location": self.location
        }

class PurchaseOrder(db.Model):
    __tablename__ = 'purchase_orders'
    REQUIRED_FIELDS = ['supplier_id']
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    supplier = db.relationship('Supplier', backref='purchase_orders')
    order_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='draft')
    total_amount = db.Column(db.Numeric(10, 2), default=0.0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "po_number": f"PO-{self.id:04d}",
            "supplier_id": self.supplier_id,
            "supplier_name": self.supplier.name if self.supplier else None,
            "order_date": str(self.order_date) if self.order_date else None,
            "status": self.status,
            "total_amount": float(self.total_amount) if self.total_amount else 0,
            "notes": self.notes,
            "created_at": str(self.created_at) if self.created_at else None
        }

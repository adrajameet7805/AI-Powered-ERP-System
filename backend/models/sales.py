from database import db

class SalesOrder(db.Model):
    __tablename__ = 'sales_orders'
    REQUIRED_FIELDS = ['customer_id', 'order_date']
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    customer = db.relationship('Customer', backref='orders')
    order_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='draft')
    total_amount = db.Column(db.Numeric(10, 2), default=0.0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "customer_id": self.customer_id, 
            "customer_name": self.customer.name if self.customer else None,
            "order_date": str(self.order_date) if self.order_date else None,
            "status": self.status, "total_amount": float(self.total_amount) if self.total_amount else 0,
            "notes": self.notes, "created_at": str(self.created_at) if self.created_at else None
        }

class Invoice(db.Model):
    __tablename__ = 'invoices'
    REQUIRED_FIELDS = ['customer_id', 'amount', 'due_date']
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    customer = db.relationship('Customer', backref='invoices')
    amount = db.Column(db.Numeric(10, 2), default=0.0)
    paid_amount = db.Column(db.Numeric(10, 2), default=0.0)
    due_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='unpaid')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "customer_id": self.customer_id,
            "customer_name": self.customer.name if self.customer else None,
            "amount": float(self.amount) if self.amount else 0,
            "paid_amount": float(self.paid_amount) if self.paid_amount else 0,
            "due_date": str(self.due_date) if self.due_date else None,
            "status": self.status, "created_at": str(self.created_at) if self.created_at else None
        }

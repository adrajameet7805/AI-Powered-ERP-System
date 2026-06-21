from database import db

class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    account_type = db.Column(db.String(50), default='asset')
    balance = db.Column(db.Numeric(10, 2), default=0.0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "account_type": self.account_type,
            "balance": float(self.balance) if self.balance else 0,
            "created_at": str(self.created_at) if self.created_at else None
        }

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer)
    txn_type = db.Column(db.String(50), default='debit')
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    reference = db.Column(db.String(100))
    description = db.Column(db.Text)
    txn_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "account_id": self.account_id, "txn_type": self.txn_type,
            "amount": float(self.amount) if self.amount else 0,
            "reference": self.reference, "description": self.description,
            "txn_date": str(self.txn_date) if self.txn_date else None,
            "created_at": str(self.created_at) if self.created_at else None
        }

class Expense(db.Model):
    __tablename__ = 'expenses'
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    description = db.Column(db.Text)
    expense_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "category": self.category,
            "amount": float(self.amount) if self.amount else 0,
            "description": self.description,
            "expense_date": str(self.expense_date) if self.expense_date else None,
            "status": self.status,
            "created_at": str(self.created_at) if self.created_at else None
        }

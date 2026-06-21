from database import db

class Asset(db.Model):
    __tablename__ = 'assets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    location = db.Column(db.String(100))
    purchase_date = db.Column(db.Date)
    cost = db.Column(db.Numeric(10, 2), default=0.0)
    depreciation_rate = db.Column(db.Numeric(5, 2), default=10.0)
    status = db.Column(db.String(50), default='in_use')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "category": self.category,
            "location": self.location, 
            "purchase_date": str(self.purchase_date) if self.purchase_date else None,
            "cost": float(self.cost) if self.cost else 0,
            "depreciation_rate": float(self.depreciation_rate) if self.depreciation_rate else 0,
            "status": self.status,
            "created_at": str(self.created_at) if self.created_at else None
        }

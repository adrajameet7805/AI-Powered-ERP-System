from database import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    sku = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(100))
    unit_price = db.Column(db.Numeric(10, 2))
    cost_price = db.Column(db.Numeric(10, 2))
    reorder_level = db.Column(db.Integer, default=10)
    current_stock = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='active')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sku": self.sku,
            "category": self.category,
            "unit_price": float(self.unit_price) if self.unit_price else 0,
            "cost_price": float(self.cost_price) if self.cost_price else 0,
            "reorder_level": self.reorder_level,
            "current_stock": self.current_stock,
            "status": self.status
        }

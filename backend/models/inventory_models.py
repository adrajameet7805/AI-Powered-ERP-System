from database import db

class Warehouse(db.Model):
    __tablename__ = 'warehouses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200))

    def to_dict(self):
        return {"id": self.id, "name": self.name, "location": self.location}

class InventoryItem(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(100), unique=True, nullable=False)
    quantity = db.Column(db.Integer, default=0)
    warehouse_id = db.Column(db.Integer)
    last_updated = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "sku": self.sku, "quantity": self.quantity,
            "warehouse_id": self.warehouse_id, 
            "last_updated": str(self.last_updated) if self.last_updated else None
        }

class StockMovement(db.Model):
    __tablename__ = 'stock_movements'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer)
    movement_type = db.Column(db.String(50), default='in')
    quantity = db.Column(db.Integer, default=1)
    reference = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "product_id": self.product_id, 
            "movement_type": self.movement_type, "quantity": self.quantity,
            "reference": self.reference, "notes": self.notes,
            "created_at": str(self.created_at) if self.created_at else None
        }

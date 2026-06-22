from database import db

class Customer(db.Model):
    __tablename__ = 'customers'
    REQUIRED_FIELDS = ['name']
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    status = db.Column(db.String(50), default='active')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "company": self.company,
            "email": self.email, "phone": self.phone, "status": self.status,
            "created_at": str(self.created_at) if self.created_at else None
        }

class Lead(db.Model):
    __tablename__ = 'leads'
    REQUIRED_FIELDS = ['name']
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120))
    source = db.Column(db.String(100))
    stage = db.Column(db.String(50), default='new')
    value = db.Column(db.Numeric(10, 2), default=0.0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "email": self.email,
            "source": self.source, "stage": self.stage,
            "value": float(self.value) if self.value else 0,
            "created_at": str(self.created_at) if self.created_at else None
        }

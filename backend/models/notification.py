from database import db

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    recipient_role = db.Column(db.String(50))  # "Admin","Manager","Employee", or "all"
    recipient_email = db.Column(db.String(120), nullable=True)  # specific user if needed
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text)
    type = db.Column(db.String(50), default='info')  # info, hr, inventory, finance, purchase
    read = db.Column(db.Boolean, default=False)
    related_id = db.Column(db.Integer, nullable=True)
    related_type = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "recipient_role": self.recipient_role,
            "recipient_email": self.recipient_email,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "read": self.read,
            "related_id": self.related_id,
            "related_type": self.related_type,
            "created_at": str(self.created_at) if self.created_at else None,
        }


from database import db

class Project(db.Model):
    __tablename__ = 'projects'
    REQUIRED_FIELDS = ['name']
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='planning')
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    budget = db.Column(db.Numeric(10, 2), default=0.0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "description": self.description,
            "status": self.status, 
            "start_date": str(self.start_date) if self.start_date else None,
            "end_date": str(self.end_date) if self.end_date else None,
            "budget": float(self.budget) if self.budget else 0,
            "created_at": str(self.created_at) if self.created_at else None
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    REQUIRED_FIELDS = ['project_id', 'title']
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    project = db.relationship('Project', backref='tasks')
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='todo')
    priority = db.Column(db.String(50), default='medium')
    due_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "project_id": self.project_id, "title": self.title,
            "project_name": self.project.name if self.project else None,
            "description": self.description, "status": self.status, "priority": self.priority,
            "due_date": str(self.due_date) if self.due_date else None,
            "created_at": str(self.created_at) if self.created_at else None
        }

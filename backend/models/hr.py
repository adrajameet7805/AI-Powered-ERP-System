from database import db

class Employee(db.Model):
    __tablename__ = 'employees'
    REQUIRED_FIELDS = ['employee_code', 'full_name']
    id = db.Column(db.Integer, primary_key=True)
    employee_code = db.Column(db.String(50), unique=True, nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120))
    department = db.Column(db.String(100))
    position = db.Column(db.String(100))
    hire_date = db.Column(db.Date)
    salary = db.Column(db.Numeric(10, 2), default=0.0)
    status = db.Column(db.String(50), default='active')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "employee_code": self.employee_code, "full_name": self.full_name,
            "email": self.email, "department": self.department, "position": self.position,
            "hire_date": str(self.hire_date) if self.hire_date else None,
            "salary": float(self.salary) if self.salary else 0, "status": self.status,
            "created_at": str(self.created_at) if self.created_at else None
        }

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    employee = db.relationship('Employee', backref='attendances')
    attendance_date = db.Column(db.Date)
    check_in = db.Column(db.String(20))
    check_out = db.Column(db.String(20))
    status = db.Column(db.String(50), default='present')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "employee_id": self.employee_id,
            "employee_name": self.employee.full_name if self.employee else None,
            "attendance_date": str(self.attendance_date) if self.attendance_date else None,
            "check_in": self.check_in, "check_out": self.check_out, "status": self.status,
            "created_at": str(self.created_at) if self.created_at else None
        }

class LeaveRequest(db.Model):
    __tablename__ = 'leave_requests'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    employee = db.relationship('Employee', backref='leave_requests')
    leave_type = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id, "employee_id": self.employee_id, 
            "employee_name": self.employee.full_name if self.employee else None,
            "leave_type": self.leave_type,
            "start_date": str(self.start_date) if self.start_date else None,
            "end_date": str(self.end_date) if self.end_date else None,
            "reason": self.reason, "status": self.status,
            "created_at": str(self.created_at) if self.created_at else None
        }

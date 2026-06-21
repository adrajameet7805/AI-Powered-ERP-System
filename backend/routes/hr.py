from flask import Blueprint
from routes.crud import create_crud_routes
from models.hr import Employee, Attendance, LeaveRequest

hr_bp = Blueprint('hr', __name__)

create_crud_routes(hr_bp, Employee, 'employees')
create_crud_routes(hr_bp, Attendance, 'attendance')
create_crud_routes(hr_bp, LeaveRequest, 'leave_requests')

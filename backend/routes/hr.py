from flask import Blueprint, jsonify, request
import jwt
from config import Config
from database import db
from routes.crud import create_crud_routes
from models.hr import Employee, Attendance, LeaveRequest
from routes.auth import token_required

hr_bp = Blueprint('hr', __name__)

create_crud_routes(hr_bp, Employee, 'employees', roles=["Admin", "Manager"])
create_crud_routes(hr_bp, Attendance, 'attendance', roles=["Admin", "Manager"])
create_crud_routes(hr_bp, LeaveRequest, 'leave_requests', roles=["Admin", "Manager", "Employee"], skip_get=True)

@hr_bp.route('/leave_requests', methods=['GET'])
@token_required(roles=["Admin", "Manager", "Employee"])
def get_leave_requests():
    token = request.headers['Authorization'].split(" ")[1]
    data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
    role = data.get('role')
    email = data.get('sub')

    if role == "Employee":
        emp = Employee.query.filter_by(email=email).first()
        if emp:
            requests = LeaveRequest.query.filter_by(employee_id=emp.id).all()
        else:
            requests = []
    else:
        requests = LeaveRequest.query.all()

    return jsonify({"data": [r.to_dict() for r in requests], "total": len(requests)}), 200

@hr_bp.route('/leave_requests/<int:id>/status', methods=['PATCH'])
@token_required(roles=["Admin", "Manager"])
def update_leave_status(id):
    data = request.json
    new_status = data.get("status")
    reason = data.get("reason", "")

    if new_status not in ["approved", "rejected"]:
        return jsonify({"error": "Status must be approved or rejected"}), 400

    leave = LeaveRequest.query.get(id)
    if not leave:
        return jsonify({"error": "Not found"}), 404

    leave.status = new_status
    db.session.commit()

    from models.notification import Notification
    notif = Notification(
        recipient_role="Employee",
        title=f"Leave request {new_status}",
        message=f"Your {leave.leave_type} leave ({leave.start_date} to {leave.end_date}) "
                f"has been {new_status}" +
                (f". Reason: {reason}" if reason else "."),
        type="hr",
        related_id=id,
        related_type="leave_request"
    )
    db.session.add(notif)
    db.session.commit()

    return jsonify(leave.to_dict()), 200

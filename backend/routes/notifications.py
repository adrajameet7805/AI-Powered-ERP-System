from flask import Blueprint, request, jsonify
from database import db
from models.notification import Notification
from routes.auth import token_required
import jwt
from config import Config
from models.user import User

notifications_bp = Blueprint('notifications', __name__)

def get_current_user(req):
    token = None
    if 'Authorization' in req.headers:
        token = req.headers['Authorization'].split(" ")[1]
    if token:
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            return User.query.filter_by(email=data['sub']).first()
        except:
            pass
    return None

@notifications_bp.route('/notifications', methods=['GET'])
@token_required()
def get_notifications():
    try:
        user = get_current_user(request)
        if not user:
            return jsonify({"error": "User not found"}), 401
        notifications = Notification.query.filter_by(user_id=user.id).order_by(Notification.created_at.desc()).all()
        return jsonify([n.to_dict() for n in notifications]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notifications_bp.route('/notifications', methods=['POST'])
@token_required()
def create_notifications():
    try:
        user = get_current_user(request)
        if not user:
            return jsonify({"error": "User not found"}), 401
            
        data = request.json
        if not isinstance(data, list):
            data = [data]
            
        for item in data:
            n = Notification(
                user_id=item.get('user_id', user.id),
                title=item.get('title'),
                message=item.get('message'),
                type=item.get('type'),
                read=False
            )
            db.session.add(n)
        db.session.commit()
        return jsonify({"message": "Notifications created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@notifications_bp.route('/notifications/<int:id>', methods=['PATCH'])
@token_required()
def update_notification(id):
    try:
        data = request.json
        notification = Notification.query.get(id)
        if not notification:
            return jsonify({"error": "Not found"}), 404
            
        if 'read' in data:
            notification.read = data['read']
            
        db.session.commit()
        return jsonify(notification.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@notifications_bp.route('/notifications/<int:id>', methods=['DELETE'])
@token_required()
def delete_notification(id):
    try:
        notification = Notification.query.get(id)
        if not notification:
            return jsonify({"error": "Not found"}), 404
            
        db.session.delete(notification)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

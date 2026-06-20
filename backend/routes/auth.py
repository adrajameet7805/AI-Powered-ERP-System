from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime
from config import Config

auth_bp = Blueprint('auth', __name__)

from werkzeug.security import check_password_hash
from models.user import User

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        token = jwt.encode({
            'sub': user.email,
            'role': user.role,
            'exp': datetime.utcnow() + Config.JWT_EXPIRATION_DELTA
        }, Config.JWT_SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'access_token': token,
            'user': {'email': user.email, 'role': user.role}
        })

    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    return jsonify({'message': 'Registration successful'}), 201

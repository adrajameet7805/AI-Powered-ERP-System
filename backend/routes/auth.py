from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime
from config import Config
from werkzeug.security import check_password_hash, generate_password_hash
from models.user import User
from database import db
from functools import wraps
from extensions import limiter

auth_bp = Blueprint('auth', __name__)

def token_required(roles=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]
                
            if not token:
                return jsonify({'error': 'Token is missing!'}), 401
                
            try:
                data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
                current_user = User.query.filter_by(email=data['sub']).first()
                if not current_user:
                    return jsonify({'error': 'User not found!'}), 401
                    
                if roles and current_user.role not in roles:
                    return jsonify({'error': 'Unauthorized role!'}), 403
                    
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired!'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Token is invalid!'}), 401
            except Exception as e:
                return jsonify({'error': str(e)}), 401
                
            return f(*args, **kwargs)
        return decorated
    return decorator

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
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
        
        refresh_token = jwt.encode({
            'sub': user.email,
            'exp': datetime.utcnow() + Config.JWT_REFRESH_EXPIRATION_DELTA
        }, Config.JWT_SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'access_token': token,
            'refresh_token': refresh_token,
            'user': {'email': user.email, 'role': user.role}
        })

    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Employee')
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
        
    hashed_pw = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed_pw, role=role)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Registration successful'}), 201

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json()
    refresh_token = data.get('token')
    
    if not refresh_token:
        return jsonify({'error': 'Refresh token missing'}), 401
        
    try:
        data = jwt.decode(refresh_token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        user = User.query.filter_by(email=data['sub']).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 401
            
        token = jwt.encode({
            'sub': user.email,
            'role': user.role,
            'exp': datetime.utcnow() + Config.JWT_EXPIRATION_DELTA
        }, Config.JWT_SECRET_KEY, algorithm='HS256')
        
        return jsonify({'access_token': token}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Refresh token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid refresh token!'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@auth_bp.route('/users', methods=['GET'])
@token_required(roles=["Admin"])
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    user_list = []
    for u in users:
        user_list.append({
            'id': str(u.id),
            'email': u.email,
            'full_name': u.email.split('@')[0],
            'created_at': u.created_at.isoformat() if u.created_at else None,
            'roles': [u.role] if u.role else []
        })
    return jsonify(user_list), 200

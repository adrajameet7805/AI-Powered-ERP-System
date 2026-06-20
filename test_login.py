import os
import sys
from werkzeug.security import generate_password_hash

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
os.environ['SECRET_KEY'] = 'test-secret'
os.environ['JWT_SECRET_KEY'] = 'test-jwt-secret'

from app import create_app
from database import db
from models.user import User

app = create_app()

with app.app_context():
    # Create tables
    db.create_all()
    
    # Insert seed data
    admin = User(email='admin@synergybeam.com', password_hash=generate_password_hash('Admin@123'), role='Admin')
    manager = User(email='manager@synergybeam.com', password_hash=generate_password_hash('Admin@123'), role='Manager')
    employee = User(email='employee@synergybeam.com', password_hash=generate_password_hash('Admin@123'), role='Employee')
    
    db.session.add_all([admin, manager, employee])
    db.session.commit()

    # Test login
    client = app.test_client()
    print("Testing valid login...")
    response = client.post('/api/auth/login', json={'email': 'admin@synergybeam.com', 'password': 'Admin@123'})
    
    if response.status_code == 200:
        data = response.get_json()
        print("Login successful!")
        print("Token:", data.get('access_token')[:20] + "...")
        print("User:", data.get('user'))
    else:
        print("Login failed!", response.status_code, response.get_data())

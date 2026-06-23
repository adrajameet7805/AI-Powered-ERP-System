import pytest
from app import create_app
from database import db as _db

@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-jwt-secret",
        "SECRET_KEY": "test-secret",
    })
    with app.app_context():
        _db.create_all()
        _seed_test_data(app)
        yield app
        _db.drop_all()

def _seed_test_data(app):
    from models.user import User
    from werkzeug.security import generate_password_hash
    from database import db
    users = [
        User(email="admin@test.com",
             password_hash=generate_password_hash("Admin@123"), role="Admin"),
        User(email="manager@test.com",
             password_hash=generate_password_hash("Admin@123"), role="Manager"),
        User(email="employee@test.com",
             password_hash=generate_password_hash("Admin@123"), role="Employee"),
    ]
    for u in users: db.session.add(u)
    db.session.commit()

@pytest.fixture(scope="session")
def client(app):
    return app.test_client()

@pytest.fixture(scope="session")
def admin_token(client):
    res = client.post("/api/auth/login",
                      json={"email": "admin@test.com", "password": "Admin@123"})
    return res.get_json()["access_token"]

@pytest.fixture(scope="session")
def manager_token(client):
    res = client.post("/api/auth/login",
                      json={"email": "manager@test.com", "password": "Admin@123"})
    return res.get_json()["access_token"]

@pytest.fixture(scope="session")
def employee_token(client):
    res = client.post("/api/auth/login",
                      json={"email": "employee@test.com", "password": "Admin@123"})
    return res.get_json()["access_token"]

def auth(token):
    return {"Authorization": f"Bearer {token}"}

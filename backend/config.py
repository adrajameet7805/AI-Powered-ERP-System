import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-super-secret-key')
    # Use SQLite by default for local dev if DATABASE_URL is not set
    _db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'synergybeam.db'))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'sqlite:///{_db_path}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-super-secret-key')
    JWT_EXPIRATION_DELTA = timedelta(hours=1)
    JWT_REFRESH_EXPIRATION_DELTA = timedelta(days=30)

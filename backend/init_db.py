import os
import sqlite3
from app import create_app
from database import db

db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'synergybeam.db'))
os.environ['DATABASE_URL'] = f'sqlite:///{db_path}'

app = create_app()

with app.app_context():
    print("Creating tables via schema.sql...")
    try:
        db_path = os.path.join(os.path.dirname(__file__), 'synergybeam.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        with open('../database/schema.sql', 'r') as f:
            schema_sql = f.read()
            # Convert Postgres types to SQLite
            schema_sql = schema_sql.replace('SERIAL PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT')
            cursor.executescript(schema_sql)
            
        print("Loading seed data...")
        with open('../database/seed.sql', 'r') as f:
            seed_sql = f.read()
            cursor.executescript(seed_sql)
            
        conn.commit()
        conn.close()
        print("Database initialized completely.")
    except Exception as e:
        print(f"Error initializing DB: {e}")

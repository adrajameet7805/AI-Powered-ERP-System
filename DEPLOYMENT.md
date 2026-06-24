# Deployment Guide

SynergyBeam ERP is fully containerized using Docker and Docker Compose. This guide outlines how to deploy the application in a production-ready environment using PostgreSQL.

## Prerequisites
- Docker
- Docker Compose
- Node.js (for local development without Docker)
- Python 3.10+ (for local development without Docker)

## Production Deployment (Docker)

1. **Configure Environment Variables**
   Create a `.env` file based on `backend/.env.production` in the `backend/` directory:
   ```env
   SECRET_KEY=your-secure-secret-key
   JWT_SECRET_KEY=your-secure-jwt-key
   DATABASE_URL=postgresql://postgres:postgres@db:5432/synergybeam
   ```

2. **Build and Start Containers**
   Run the following command from the project root to spin up the PostgreSQL database, Python backend, and React frontend:
   ```bash
   docker-compose -f backend/docker-compose.yml up -d --build
   ```

3. **Database Initialization**
   The PostgreSQL instance is automatically seeded with schema and initial data via the mounted volumes (`schema.sql` and `seed.sql`) upon first initialization.

4. **Access the Application**
   - Frontend UI: `http://localhost:8080`
   - Backend API: `http://localhost:5000`

## Local Development (Without Docker)

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
   pip install -r requirements.txt
   python init_db.py         # This will create a local SQLite fallback DB
   python app.py
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

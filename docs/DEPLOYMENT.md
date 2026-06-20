# Deployment Guide

This project is fully dockerized using `docker-compose`.

## Prerequisites
- Docker
- Docker Compose

## Running the Project
```bash
docker-compose up --build -d
```

This will spin up:
1. **PostgreSQL** database on port `5432` with pre-seeded data.
2. **Flask Backend** API on port `5000`.
3. **React Frontend** on port `8080`.

Access the frontend by visiting `http://localhost:8080/`.

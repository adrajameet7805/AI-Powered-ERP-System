<div align="center">

<img src="screenshots/logo.png" alt="SynergyBeam ERP Logo" width="160" />

<br/>

# ✦ SynergyBeam ERP ✦

**An AI-powered Enterprise Resource Planning system built with React, Flask, and Facebook Prophet — designed as a full-stack college capstone project demonstrating end-to-end business process management.**

[![Version](https://img.shields.io/badge/Version-1.0.0-blueviolet?style=for-the-badge&logo=github)](https://github.com/adrajameet7805)
[![License: MIT](https://img.shields.io/badge/License-MIT-success?style=for-the-badge&logo=opensourceinitiative)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge&logo=githubactions)](https://github.com/adrajameet7805/AI-Powered-ERP-System)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue?style=for-the-badge&logo=git)](https://github.com/adrajameet7805/AI-Powered-ERP-System/pulls)

<br/>

[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-cyan.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Flask-2.x-black.svg?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![AI Ready](https://img.shields.io/badge/AI_Powered-Scikit--Learn-orange.svg?style=for-the-badge&logo=scikitlearn)](https://scikit-learn.org/)
[![Security](https://img.shields.io/badge/Security-JWT_%7C_RBAC-critical.svg?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![Made With Love](https://img.shields.io/badge/Made%20With-❤️-red?style=for-the-badge)]()

<br/>

<a href="https://github.com/adrajameet7805/AI-Powered-ERP-System">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=22&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=600&lines=Modern.+Fast.+Decoupled.;AI-Powered+Forecasting+Engine;Enterprise-Grade+Security" alt="Typing SVG" />
</a>

> 📸 **Screenshots / Demo GIF** — Add a screen recording here using tools like [Kap](https://getkap.co/) or [ScreenToGif](https://www.screentogif.com/) and upload to this repo under `/docs/demo.gif`

</div>

<br/>

---

<br/>

## 📖 About This Project

SynergyBeam ERP is a comprehensive, 9-module system designed to unify operations across multiple business departments. It integrates CRM, Inventory, Sales, Purchase, Accounting, HRMS, Projects, Assets, and AI Forecasting into one unified platform, built to demonstrate a realistic enterprise architecture.

At its core, SynergyBeam features a native AI layer. The system uses Facebook Prophet for time-series demand forecasting and Scikit-Learn for anomaly detection. It generates actionable reorder recommendations per SKU by calculating the 30-day forecasted demand against current stock and reorder levels.

The project is built on a decoupled architecture, fusing a React + TypeScript frontend (bundled with Vite) with a Python Flask REST API backend. Data is managed by SQLAlchemy ORM on top of SQLite for local development and PostgreSQL for production deployments. The entire stack is fully containerized using Docker Compose for seamless environment parity.

This project is a college capstone demonstrating full-stack development, REST API design, relational database modeling, and applied machine learning. It is not yet production-ready (missing unit tests, rate limiting, and CI/CD pipeline) but serves as a strong foundation for further development.

<br/>

---

<br/>

## 🏆 Functional Modules

| Module | What it does |
|---|---|
| 🤝 CRM | Manage customers and leads across a sales pipeline |
| 📦 Inventory | Track products, stock levels, and warehouse movements |
| 🛍️ Sales | Create and manage sales orders and invoices |
| 🛒 Purchase | Manage suppliers and purchase orders |
| 💼 Accounting | Track accounts, transactions, and expenses |
| 👥 HRMS | Employee records, attendance, and leave requests |
| 🏗️ Projects | Project and task management with status tracking |
| 🖥️ Assets | Register and track company assets and depreciation |
| 🤖 AI Forecast | Prophet + Scikit-Learn demand forecasting per SKU |
| 📊 Reports | Export data to PDF and Excel (.xlsx) |

<br/>

---

<br/>

## 🏗️ Enterprise Architecture

```mermaid
graph TD
    classDef client fill:#0ea5e9,stroke:#0284c7,color:#fff
    classDef api fill:#10b981,stroke:#059669,color:#fff
    classDef service fill:#6366f1,stroke:#4f46e5,color:#fff
    classDef db fill:#f59e0b,stroke:#d97706,color:#fff
    classDef ai fill:#ec4899,stroke:#db2777,color:#fff

    Browser[🌐 Browser — React + Vite + TypeScript]:::client
    Flask[⚡ Flask REST API — Python 3.10+]:::api

    Auth[🔐 JWT Auth + RBAC]:::service
    CRUD[🏢 ERP Modules — 9 Blueprints]:::service
    Export[📄 PDF + Excel Export]:::service
    AI[🧠 Prophet + Scikit-Learn]:::ai

    DB[(🐘 PostgreSQL — Production)]:::db
    SQLite[(📁 SQLite — Development)]:::db

    Browser -->|REST + Bearer JWT| Flask
    Flask --> Auth
    Flask --> CRUD
    Flask --> Export
    Flask --> AI
    CRUD --> DB
    CRUD --> SQLite
    AI -->|Reads stock history| DB
```

<br/>

---

<br/>

## 🛠️ Technology Stack

<details open>
<summary><b>🎨 Frontend</b></summary>
<br/>

- React 18, Vite, TypeScript
- Tailwind CSS v4
- TanStack React Query v5
- React Router v6
- Recharts
- Radix UI / ShadCN

</details>

<details open>
<summary><b>⚙️ Backend</b></summary>
<br/>

- Python 3.10+, Flask
- SQLAlchemy, PostgreSQL, SQLite
- PyJWT, Werkzeug.security

</details>

<details open>
<summary><b>🧠 Data Science & AI</b></summary>
<br/>

- Pandas, NumPy, Scikit-Learn
- Prophet (Facebook)
- ReportLab (PDF), OpenPyXL (Excel)

</details>

<details open>
<summary><b>🚢 DevOps</b></summary>
<br/>

- Docker, Docker Compose, GitHub

</details>

<br/>

---

<br/>

## 📂 Project Structure

```text
AI-Powered-ERP-System/
├── backend/                    # Python Flask REST API
│   ├── app.py                  # Application factory + blueprint registration
│   ├── config.py               # Configuration (DB URI, JWT secrets)
│   ├── requirements.txt        # Python dependencies
│   ├── ai_service/
│   │   └── forecaster.py       # Prophet + Scikit-Learn forecasting engine
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── user.py             # User + RBAC roles
│   │   ├── crm.py              # Customer, Lead
│   │   ├── sales.py            # SalesOrder, Invoice
│   │   ├── purchase.py         # Supplier, PurchaseOrder
│   │   ├── hr.py               # Employee, Attendance, LeaveRequest
│   │   ├── accounting.py       # Account, Transaction, Expense
│   │   ├── projects.py         # Project, Task
│   │   ├── assets.py           # Asset
│   │   ├── product.py          # Product (inventory catalog)
│   │   └── inventory_models.py # Warehouse, StockMovement
│   └── routes/                 # Flask blueprints
│       ├── auth.py             # Login, JWT generation, token_required decorator
│       ├── crud.py             # Generic CRUD factory (GET, POST, DELETE)
│       ├── inventory.py        # Product-specific endpoints
│       ├── forecast.py         # AI demand forecasting endpoint
│       └── export.py           # PDF + Excel export endpoints
│
├── frontend/                   # React SPA (Vite + TypeScript)
│   └── src/
│       ├── components/
│       │   ├── resource-table.tsx  # Shared table with Add + Delete (used by all modules)
│       │   ├── module-shell.tsx    # PageHeader, StatPill, StatusBadge
│       │   └── app-sidebar.tsx     # Navigation sidebar
│       ├── hooks/
│       │   └── use-auth.tsx        # JWT auth context hook
│       ├── pages/              # One file per module
│       │   ├── dashboard.tsx, crm.tsx, inventory.tsx, sales.tsx
│       │   ├── purchase.tsx, accounting.tsx, hr.tsx, projects.tsx
│       │   ├── assets.tsx, ai-forecast.tsx, reports.tsx
│       │   ├── users.tsx, notifications.tsx
│       └── services/
│           └── api.ts          # Axios instance with JWT interceptor
│
├── database/
│   ├── schema.sql              # PostgreSQL schema (used by Docker)
│   └── seed.sql                # Default demo data + user accounts
│
└── docker-compose.yml          # Spins up Flask + React + PostgreSQL
```

<br/>

---

<br/>

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Python 3.10+
- Git

### Option A — Local Development (Recommended for first run)

Step 1: Clone
```bash
git clone https://github.com/adrajameet7805/AI-Powered-ERP-System.git
cd AI-Powered-ERP-System
```

Step 2: Start the backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac / Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
> API runs at http://localhost:5000  
> SQLite database is created automatically at backend/synergybeam.db on first run

Step 3: Start the frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
> UI runs at http://localhost:5173

Step 4: Log in

| Role | Email | Password |
|---|---|---|
| Admin | admin@synergybeam.com | Admin@123 |
| Manager | manager@synergybeam.com | Admin@123 |
| Employee | employee@synergybeam.com | Admin@123 |

> Note: The SQLite dev database starts empty. Add records through the UI
> or run the seed script: `sqlite3 synergybeam.db < ../database/seed.sql`

### Option B — Docker (Full stack with PostgreSQL)
```bash
docker-compose up --build
```
> This seeds the PostgreSQL database automatically using database/seed.sql

<br/>

---

<br/>

## ⚙️ Environment Variables

```env
# backend/.env (copy this, never commit it)

# Database (leave blank to use SQLite for local dev)
DATABASE_URL=postgresql://user:password@localhost:5432/synergybeam

# Security — generate random 32-char strings for production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# Environment
FLASK_ENV=development
```

Frontend environment:
```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

<br/>

---

<br/>

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | None | Login — returns access_token + refresh_token |
| GET | /api/auth/users | Bearer JWT | List all users |
| GET | /api/inventory/products | Bearer JWT | List all products |
| POST | /api/inventory/products | Bearer JWT | Add a new product |
| DELETE | /api/inventory/products/\<id\> | Bearer JWT | Delete a product |
| GET | /api/customers | Bearer JWT | List all customers |
| POST | /api/customers | Bearer JWT | Create a customer |
| GET | /api/leads | Bearer JWT | List all leads |
| GET | /api/sales_orders | Bearer JWT | List all sales orders |
| GET | /api/invoices | Bearer JWT | List all invoices |
| GET | /api/employees | Bearer JWT | List all employees |
| GET | /api/projects | Bearer JWT | List all projects |
| GET | /api/forecast/ | Bearer JWT | Run AI demand forecast |
| GET | /api/export/excel/\<module\> | Bearer JWT | Download Excel export |
| GET | /api/export/pdf/\<module\> | Bearer JWT | Download PDF export |
| GET | /api/health | None | Health check |

<br/>

---

<br/>

## 🛡️ Security

SynergyBeam implements the following security measures:

- **Password hashing** — Werkzeug's scrypt-based hashing (never plaintext)
- **JWT authentication** — Stateless tokens with configurable expiry (default 1 hour)
- **Refresh tokens** — 30-day refresh tokens for session continuity
- **Role-based access control** — Admin, Manager, Employee roles enforced per endpoint via @token_required decorator
- **SQL injection prevention** — All queries use SQLAlchemy ORM parameterization (no raw SQL)
- **CORS** — Cross-origin requests configured via Flask-CORS

Known limitations (planned improvements):
- Rate limiting not yet implemented
- No HTTPS enforcement in dev mode
- CORS currently allows all origins (needs restriction for production)

<br/>

---

<br/>

## 🗺️ Known Issues + Roadmap

Known issues:
- [ ] Dashboard KPI cards show hardcoded demo data (not live from DB)
- [ ] AI forecasting uses randomly generated sales history (not real transactions)
- [ ] No edit (PUT) endpoint — records can be created and deleted but not updated
- [ ] Users page and Notifications page have broken Supabase migration leftovers
- [ ] No unit or integration tests

Roadmap:
- [ ] Connect dashboard to live database aggregations
- [ ] Wire AI forecasting to real stock movement history
- [ ] Add PUT/PATCH endpoints for editing all records
- [ ] Add pagination and search to all list endpoints
- [ ] Write pytest unit tests for all routes
- [ ] Add rate limiting with Flask-Limiter
- [ ] CI/CD pipeline with GitHub Actions

Completed:
- [x] Full 9-module ERP architecture
- [x] JWT authentication + RBAC
- [x] Generic CRUD factory pattern
- [x] Prophet + Scikit-Learn AI forecasting engine
- [x] PDF and Excel export
- [x] Docker Compose deployment
- [x] Dark/Light theme support

<br/>

---

<br/>

## 🤝 Contributing

We welcome pull requests from the community!

```bash
# Verify the API is healthy
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@synergybeam.com","password":"Admin@123"}'
```

<br/>

---

<br/>

## 📜 License

This software is released under the **MIT License**. You are free to use, modify, distribute, and commercialize this software as long as the original copyright notice is included.

<br/>

---

<br/>

<div align="center">

### 👨‍💻 Developed & Maintained By

**Meet Adraja**  
*Full-Stack & Systems Architecture*  
[![GitHub](https://img.shields.io/badge/GitHub-%40adrajameet7805-181717?style=flat-square&logo=github)](https://github.com/adrajameet7805)

*If this project inspired you, please consider starring the repository.* ⭐

</div>

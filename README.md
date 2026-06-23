<div align="center">

<br/>

# ⚡ SynergyBeam ERP

**An AI-powered Enterprise Resource Planning system built with React, Flask, and Facebook Prophet.**

[![Version](https://img.shields.io/badge/Version-2.0.0-blueviolet?style=for-the-badge&logo=github)](https://github.com/adrajameet7805)
[![License: MIT](https://img.shields.io/badge/License-MIT-success?style=for-the-badge&logo=opensourceinitiative)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge&logo=githubactions)](https://github.com/adrajameet7805/AI-Powered-ERP-System)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue?style=for-the-badge&logo=git)](https://github.com/adrajameet7805/AI-Powered-ERP-System/pulls)
[![Made With Love](https://img.shields.io/badge/Made%20With-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)](https://github.com/adrajameet7805)

<br/>

[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-cyan.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Flask-3.0-black.svg?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Prophet](https://img.shields.io/badge/AI-Facebook_Prophet-orange.svg?style=for-the-badge&logo=python)](https://facebook.github.io/prophet/)
[![Security](https://img.shields.io/badge/Security-JWT_%7C_RBAC-critical.svg?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

<br/>

**[Quick Start](#-quick-start) • [Modules](#-modules) • [Role System](#-role-based-access-control) • [API Reference](#-api-reference) • [Deployment](#-deployment)**

<br/>

<a href="https://github.com/adrajameet7805/AI-Powered-ERP-System">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=20&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=700&lines=9+Integrated+Business+Modules;Live+Dashboard+KPIs+from+Real+Database;AI+Forecasting+on+Real+Stock+History;Role-Based+Access+%E2%80%94+Admin+%7C+Manager+%7C+Employee;React+%2B+Flask+%2B+PostgreSQL+%2B+Docker" alt="Typing SVG" />
</a>

<br/>



</div>

<br/>

---

<br/>

## 📖 About

**SynergyBeam ERP** is a full-stack business management system that unifies 9 core departments — CRM, Inventory, Sales, Purchase, Accounting, HR, Projects, Assets, and AI Forecasting — into a single web application.

The system implements a **3-tier role hierarchy** (Admin → Manager → Employee) where each role sees different pages, has different API permissions, and communicates with other roles through a real notification and approval workflow.

The **Executive Dashboard** shows live KPI cards pulled directly from the database — real customer counts, real product counts, real employee counts, and real revenue totals. No hardcoded numbers.

The **AI Forecasting module** uses Facebook Prophet and Scikit-Learn trained on actual `stock_movements` transaction history from the database. If a product has fewer than 14 days of history, the system displays a clear message rather than fabricating a forecast.

Built as a college capstone demonstrating end-to-end full-stack engineering: REST API design, relational database modeling, JWT + RBAC security, paginated APIs, input validation, Docker deployment, and applied machine learning.

<br/>

---

<br/>

## ✨ Modules

| Module | What it does | Who can access |
| :--- | :--- | :--- |
| 🏠 **Dashboard** | Live KPI cards from DB + revenue/inventory charts | All roles |
| 🤝 **CRM** | Customers and leads across a sales pipeline | Admin, Manager |
| 📦 **Inventory** | Products, stock levels, warehouses, movements | All roles |
| 🛍️ **Sales** | Sales orders and invoices | Admin, Manager |
| 🛒 **Purchase** | Suppliers + purchase orders with Admin approval flow | Admin, Manager |
| 💼 **Accounting** | Accounts, transactions, expenses | Admin only |
| 👥 **HRMS** | Employees, attendance, leave requests + Manager approval | Admin, Manager |
| 🏗️ **Projects** | Project and task management | All roles |
| 🖥️ **Assets** | Company asset registry and depreciation | Admin, Manager |
| 🤖 **AI Forecast** | Prophet + Scikit-Learn on real stock movement history | Admin, Manager |
| 📊 **Reports** | Live charts + CSV export for all modules | Admin, Manager |
| 🔔 **Notifications** | Cross-role alerts — leave decisions, PO approvals, AI alerts | All roles |
| 🔐 **Users & Roles** | User management and role assignment | Admin only |

<br/>

---

<br/>

## 👥 Role-Based Access Control

### Permission Matrix

| Feature | 👑 Admin | 🧑‍💼 Manager | 👤 Employee |
| :--- | :---: | :---: | :---: |
| Dashboard (live data) | ✅ | ✅ | ✅ |
| CRM | ✅ | ✅ | ❌ |
| Inventory | ✅ | ✅ | ✅ (view) |
| Sales | ✅ | ✅ | ❌ |
| Purchase | ✅ | ✅ | ❌ |
| Accounting | ✅ | ❌ | ❌ |
| HR (all staff) | ✅ | ✅ | ❌ |
| HR (own leave only) | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ✅ |
| Assets | ✅ | ✅ | ❌ |
| AI Forecasting | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ✅ |
| Users & Roles | ✅ | ❌ | ❌ |
| Approve leave requests | ✅ | ✅ | ❌ |
| Approve purchase orders | ✅ | ❌ | ❌ |

### Cross-Role Workflows

```
LEAVE APPROVAL:
  Employee submits leave request
       ↓  Manager sees pending request in HR module
       ↓  Manager clicks Approve or Reject
       ↓  Employee receives notification with decision

PURCHASE ORDER APPROVAL:
  Manager creates Purchase Order (status: pending)
       ↓  Admin sees pending PO in Purchase module
       ↓  Admin clicks Approve
       ↓  Manager receives notification — PO approved

AI STOCK ALERT:
  AI Forecast detects critical low stock per SKU
       ↓  Notification auto-created for Admin + Manager
       ↓  Manager creates Purchase Order
       ↓  Admin approves it
```

Role badges in the top navigation bar are color-coded:
🔴 **Admin** — red &nbsp;|&nbsp; 🔵 **Manager** — blue &nbsp;|&nbsp; 🟢 **Employee** — green

<br/>

---

<br/>

## 🏗️ Architecture

```mermaid
graph TD
    classDef client fill:#0ea5e9,stroke:#0284c7,color:#fff
    classDef api fill:#10b981,stroke:#059669,color:#fff
    classDef service fill:#6366f1,stroke:#4f46e5,color:#fff
    classDef db fill:#f59e0b,stroke:#d97706,color:#fff
    classDef ai fill:#ec4899,stroke:#db2777,color:#fff

    Browser["🌐 React 18 + Vite + TypeScript"]:::client
    Flask["⚡ Flask 3.0 REST API"]:::api

    Auth["🔐 JWT Auth + RBAC"]:::service
    CRUD["🏢 9 ERP Blueprints + CRUD Factory"]:::service
    Dashboard["📊 Live Dashboard Aggregations"]:::service
    Workflow["🔄 Approval Workflows + Notifications"]:::service
    Export["📄 PDF + Excel Export"]:::service
    AI["🧠 Prophet + Scikit-Learn on Real Data"]:::ai

    PG[("🐘 PostgreSQL")]:::db
    SQ[("📁 SQLite (dev)")]:::db

    Browser -->|"REST + Bearer JWT"| Flask
    Flask --> Auth
    Auth --> CRUD
    Auth --> Dashboard
    Auth --> Workflow
    Flask --> Export
    Flask --> AI
    CRUD --> PG
    CRUD --> SQ
    Dashboard -->|"Live COUNT/SUM queries"| PG
    AI -->|"Real stock_movements history"| PG
    Workflow -->|"Writes notifications table"| PG
```

**Key patterns:**
- **CRUD Factory** — `crud.py` generates paginated GET, POST, PUT, DELETE for every module automatically
- **Live Dashboard** — 4 dedicated endpoints query real COUNT/SUM aggregations on every request
- **Real AI** — Prophet trains on actual `stock_movements` outbound history per SKU
- **Shared ResourceTable** — one React component renders all 9 module tables with search + pagination

<br/>

---

<br/>

## 🛠️ Tech Stack

<details open>
<summary><b>🎨 Frontend</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework + fast HMR dev server |
| TypeScript | Type safety across all components |
| Tailwind CSS v4 | Utility-first styling |
| ShadCN UI + Radix UI | Accessible component primitives |
| TanStack React Query v5 | Server state, caching, background refetch |
| React Router v6 | Client-side routing with protected routes |
| Recharts | Interactive charts on dashboard and reports |
| Axios | HTTP client with automatic JWT injection |
| Lucide React | Icon library |

</details>

<details open>
<summary><b>⚙️ Backend</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Python 3.10+ + Flask 3.0 | REST API |
| SQLAlchemy | ORM — no raw SQL |
| PostgreSQL 15 | Production database |
| SQLite | Zero-config local development |
| PyJWT | JWT generation and validation |
| Werkzeug.security | Scrypt password hashing |
| Flask-CORS | Cross-origin handling |
| ReportLab | PDF generation |
| OpenPyXL | Excel (.xlsx) generation |

</details>

<details open>
<summary><b>🧠 AI / Data Science</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Facebook Prophet | Time-series demand forecasting per SKU |
| Scikit-Learn | Anomaly detection, overstock/understock classification |
| Pandas | Data aggregation |
| NumPy | Numerical operations |

</details>

<details open>
<summary><b>🧪 Testing</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| pytest | Backend unit + integration tests |
| pytest-flask | Flask test client fixtures |
| Vitest | Frontend unit tests |
| React Testing Library | Component tests |

</details>

<details open>
<summary><b>🐳 DevOps</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Containerized deployment |
| GitHub Actions | CI/CD — test + build on every push |

</details>

<br/>

---

<br/>

## 📂 Project Structure

```
AI-Powered-ERP-System/
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions — test + build on push
│
├── backend/
│   ├── app.py                      # App factory — registers all blueprints
│   ├── config.py                   # DB URI, JWT, environment config
│   ├── requirements.txt            # Python dependencies
│   │
│   ├── ai_service/
│   │   └── forecaster.py           # Prophet + Scikit-Learn on real stock history
│   │
│   ├── models/                     # SQLAlchemy ORM models
│   │   ├── user.py                 # User + roles
│   │   ├── notification.py         # Cross-role notifications
│   │   ├── crm.py                  # Customer, Lead
│   │   ├── product.py              # Product catalog
│   │   ├── inventory_models.py     # Warehouse, StockMovement, ForecastLog
│   │   ├── sales.py                # SalesOrder, Invoice
│   │   ├── purchase.py             # Supplier, PurchaseOrder
│   │   ├── hr.py                   # Employee, Attendance, LeaveRequest
│   │   ├── accounting.py           # Account, Transaction, Expense
│   │   ├── projects.py             # Project, Task
│   │   └── assets.py               # Asset
│   │
│   ├── routes/                     # Flask blueprints
│   │   ├── auth.py                 # Login, JWT, @token_required
│   │   ├── crud.py                 # CRUD factory: paginated GET/POST/PUT/DELETE
│   │   ├── dashboard.py            # Live KPI aggregations from DB
│   │   ├── hr.py                   # HR + leave approval endpoint
│   │   ├── purchase.py             # Purchase + PO approval endpoint
│   │   ├── notifications.py        # Cross-role notification REST endpoints
│   │   ├── inventory.py            # Product + stock movement endpoints
│   │   ├── forecast.py             # AI forecast on real stock history
│   │   └── export.py               # PDF + Excel export
│   │
│   └── tests/                      # pytest test suite
│       ├── conftest.py             # Fixtures — test app, test client, auth headers
│       ├── test_auth.py            # Login, token validation, RBAC tests
│       ├── test_crud.py            # GET/POST/PUT/DELETE for all modules
│       ├── test_dashboard.py       # Live KPI endpoint tests
│       ├── test_forecast.py        # AI forecast endpoint tests
│       └── test_validation.py      # Input validation tests
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── resource-table.tsx  # Shared table — search, pagination, CRUD
│       │   ├── error-boundary.tsx  # Global error boundary (no black screens)
│       │   ├── module-shell.tsx    # PageHeader, StatPill, StatusBadge
│       │   └── app-sidebar.tsx     # Role-filtered sidebar
│       ├── hooks/
│       │   └── use-auth.tsx        # JWT auth context + role helpers
│       ├── pages/                  # One file per module
│       │   ├── dashboard.tsx       # Live KPIs + Recharts from /api/dashboard/*
│       │   ├── crm.tsx             # Customers + Leads
│       │   ├── inventory.tsx       # Products + Stock
│       │   ├── sales.tsx           # Orders + Invoices
│       │   ├── purchase.tsx        # Suppliers + POs + approval
│       │   ├── accounting.tsx      # Accounts + Transactions + Expenses
│       │   ├── hr.tsx              # Employees + Leave + approval
│       │   ├── projects.tsx        # Projects + Tasks
│       │   ├── assets.tsx          # Asset registry
│       │   ├── ai-forecast.tsx     # AI demand predictions
│       │   ├── reports.tsx         # Live charts + CSV export
│       │   ├── notifications.tsx   # Role-filtered notification center
│       │   └── users.tsx           # User management (Admin only)
│       ├── types/
│       │   └── index.ts            # Shared TypeScript interfaces
│       └── services/
│           └── api.ts              # Axios + JWT interceptor
│
├── database/
│   ├── schema.sql                  # PostgreSQL schema
│   └── seed.sql                    # Demo data + user accounts
│
└── docker-compose.yml
```

<br/>

---

<br/>

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ &nbsp;|&nbsp; **Python** 3.10+ &nbsp;|&nbsp; **Git**

### Option A — Local Development

```bash
# 1. Clone
git clone https://github.com/adrajameet7805/AI-Powered-ERP-System.git
cd AI-Powered-ERP-System

# 2. Backend
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac / Linux
pip install -r requirements.txt
python app.py
# ✅ API at http://localhost:5000

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev
# ✅ UI at http://localhost:5173
```

### Option B — Docker

```bash
docker-compose up --build
# ✅ UI at http://localhost:8080 | API at http://localhost:5000
```

<br/>

---

<br/>

## 🔑 Default Credentials

> [!CAUTION]
> Change all passwords before any public deployment.

| Role | Email | Password |
| :--- | :--- | :--- |
| 👑 Admin | `admin@synergybeam.com` | `Admin@123` |
| 🧑‍💼 Manager | `manager@synergybeam.com` | `Admin@123` |
| 👤 Employee | `employee@synergybeam.com` | `Admin@123` |

<br/>

---

<br/>

## ⚙️ Environment Variables

**backend/.env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/synergybeam
SECRET_KEY=your-secret-key-32-chars-minimum
JWT_SECRET_KEY=your-jwt-secret-32-chars-minimum
FLASK_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

<br/>

---

<br/>

## 🤖 How AI Forecasting Works

```
1. Query real outbound stock_movements per product SKU from DB
         ↓
2. Products with < 14 days history → "Insufficient data" message
         ↓
3. Products with >= 14 days → Facebook Prophet fits time-series model
         ↓
4. Prophet predicts demand for next 30 days
         ↓
5. Scikit-Learn classifies: OVERSTOCK / UNDERSTOCK / HEALTHY
         ↓
6. Plain-English recommendation generated per SKU
7. ForecastLog row saved to DB (powers activity feed)
8. Critical alerts auto-create Notifications for Admin + Manager
```

<br/>

---

<br/>

## 🌐 API Reference

All endpoints except `/api/auth/login` and `/api/health` require `Authorization: Bearer TOKEN`.

**Paginated responses** (all list endpoints):
```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "pages": 2,
  "per_page": 50
}
```
Use `?page=2&per_page=25&search=keyword` query params on any list endpoint.

**Auth**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Returns access_token + refresh_token |
| `GET` | `/api/auth/users` | Admin | List all users |
| `GET` | `/api/health` | Public | Health check |

**Dashboard (live DB aggregations)**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/kpis` | All | Real counts + revenue from DB |
| `GET` | `/api/dashboard/revenue-chart` | All | 6-month revenue/profit data |
| `GET` | `/api/dashboard/inventory-chart` | All | 6-week stock in/out data |
| `GET` | `/api/dashboard/activity-feed` | All | Recent activity from all modules |

**ERP Modules** (all support GET/POST/PUT/DELETE + `?search=&page=`)

| Endpoint | Roles |
| :--- | :--- |
| `/api/customers`, `/api/leads` | Admin, Manager |
| `/api/inventory/products` | All |
| `/api/sales_orders`, `/api/invoices` | Admin, Manager |
| `/api/suppliers`, `/api/purchase_orders` | Admin, Manager |
| `/api/employees`, `/api/leave_requests` | Admin, Manager (Employee: own leave only) |
| `/api/projects`, `/api/tasks` | All |
| `/api/assets` | Admin, Manager |
| `/api/accounts`, `/api/transactions`, `/api/expenses` | Admin |

**Workflows**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `PATCH` | `/api/leave_requests/<id>/status` | Admin, Manager | Approve / reject leave |
| `PATCH` | `/api/purchase_orders/<id>/approve` | Admin | Approve PO |

**AI + Export**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/forecast/` | Admin, Manager | Run AI forecast on real data |
| `GET` | `/api/export/excel/<module>` | Admin, Manager | Excel export |
| `GET` | `/api/export/pdf/<module>` | Admin, Manager | PDF export |

<br/>

---

<br/>

## 🧪 Running Tests

```bash
cd backend

# Install test dependencies
pip install pytest pytest-flask

# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ --cov=. --cov-report=term-missing
```

```bash
cd frontend

# Run unit tests
npm run test

# Run with coverage
npm run test -- --coverage
```

<br/>

---

<br/>

## 🔐 Security

- **Password hashing** — Werkzeug scrypt. Never plaintext.
- **JWT** — 1-hour access tokens + 30-day refresh tokens.
- **RBAC** — Every endpoint declares allowed roles via `@token_required(roles=[...])`. Unauthorized roles get HTTP 403.
- **Frontend route protection** — Restricted URLs show Access Denied, not just hidden from menu.
- **SQL injection prevention** — All queries via SQLAlchemy ORM.
- **Input validation** — Required fields validated on every POST/PUT via `REQUIRED_FIELDS` per model.

**Known limitations:**
- Rate limiting on login not yet implemented
- CORS allows all origins (restrict in production)

<br/>

---

<br/>

## 🗺️ Roadmap

**Completed ✅**
- [x] 9-module ERP with unified dashboard
- [x] JWT auth + 3-tier RBAC (Admin / Manager / Employee)
- [x] Role-filtered sidebar + protected routes
- [x] Live dashboard KPIs connected to real DB aggregations
- [x] AI forecasting trained on real stock movement history
- [x] Full CRUD (GET / POST / PUT / DELETE) on all modules
- [x] Paginated + searchable list endpoints
- [x] Input validation with required fields per model
- [x] Leave request approval workflow with notifications
- [x] Purchase order approval workflow with notifications
- [x] Cross-role notification center
- [x] PDF and Excel export
- [x] Docker Compose deployment
- [x] Error boundary (no more black screens)
- [x] Dark / Light theme

**In Progress / Planned 🔧**
- [ ] pytest test suite (conftest, auth, CRUD, dashboard, forecast, validation)
- [ ] Vitest + React Testing Library frontend tests
- [ ] GitHub Actions CI/CD pipeline
- [ ] Rate limiting on authentication endpoints
- [ ] HTTPS + CORS locked to frontend URL in production

<br/>

---

<br/>

## ❓ Troubleshooting

<details>
<summary><b>Black screen or "Something went wrong" on any page</b></summary>

Check the browser console (F12). The most common cause is the backend not running.

```bash
# Terminal 1 — backend first
cd backend && python app.py

# Terminal 2 — then frontend
cd frontend && npm run dev
```

If you see `.map is not a function` or `.filter is not a function` errors — this means the frontend is not unwrapping the paginated API response correctly. Every list endpoint returns `{ data: [...], total, page }` — access the array via `response.data?.data`.
</details>

<details>
<summary><b>401 Unauthorized on API calls</b></summary>

JWT expired (1 hour default). Log out and log back in. The frontend handles refresh automatically — if it persists, clear localStorage and re-login.
</details>

<details>
<summary><b>403 Forbidden</b></summary>

Your current role does not have permission for that endpoint. Example: Employee cannot access `/api/accounting`. Log in with Admin role to access restricted endpoints.
</details>

<details>
<summary><b>AI forecast shows "Insufficient history"</b></summary>

This is correct behavior. Prophet needs at least 14 days of outbound stock movement history per product. Add stock movements via the Inventory module, then re-run the forecast.
</details>

<details>
<summary><b>Docker build slow or fails</b></summary>

Make sure `backend/.dockerignore` exists:
```
venv/
fresh_venv/
__pycache__/
*.pyc
*.db
```
</details>

<br/>

---

<br/>

## 🤝 Contributing

1. Fork the repo
2. Branch: `git checkout -b feature/your-feature`
3. Follow PEP8 (Python) and ESLint/Prettier (TypeScript)
4. Add tests for any new endpoint
5. Open a PR with a clear description

<br/>

---

<br/>

## 📜 License

MIT License — free to use, modify, and distribute with attribution.

<br/>

---

<br/>

<div align="center">

### 👨‍💻 Built by

**Meet Adraja** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-%40adrajameet7805-181717?style=flat-square&logo=github)](https://github.com/adrajameet7805)

*If this project helped you, please give it a ⭐*

</div>
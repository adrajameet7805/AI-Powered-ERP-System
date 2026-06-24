<div align="center">

<br/>

# ⚡ SynergyBeam ERP

**A full-stack AI-powered Enterprise Resource Planning system.**
**React · Flask · PostgreSQL · Facebook Prophet · Docker**

[![Version](https://img.shields.io/badge/Version-3.0.0-blueviolet?style=for-the-badge&logo=github)](https://github.com/adrajameet7805)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](https://github.com/adrajameet7805/AI-Powered-ERP-System)
[![Build](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge&logo=githubactions)](https://github.com/adrajameet7805/AI-Powered-ERP-System/actions)
[![APIs](https://img.shields.io/badge/APIs-24%2F24_Passing-success?style=for-the-badge)](https://github.com/adrajameet7805/AI-Powered-ERP-System)
[![Made With Love](https://img.shields.io/badge/Made%20With-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)](https://github.com/adrajameet7805)

<br/>

[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-black?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://docker.com/)
[![Prophet](https://img.shields.io/badge/AI-Prophet+SKLearn-orange?style=flat-square&logo=python)](https://facebook.github.io/prophet/)

<br/>

<a href="https://github.com/adrajameet7805/AI-Powered-ERP-System">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=18&duration=3000&pause=800&color=38BDF8&center=true&vCenter=true&width=750&lines=24%2F24+APIs+Passing+✅;13+Business+Modules+in+One+Platform;Live+KPIs+from+Real+Database;AI+Demand+Forecasting+with+Prophet;RFQ+%7C+GST+Invoices+%7C+Procurement+Workflow" alt="Typing SVG" />
</a>

<br/>


</div>

<br/>

---

## 📊 Live Audit

> Tested June 2026 against real running backend

| Check | Result |
| :--- | :--- |
| API Endpoints | **24 / 24 passing** — avg 1–10ms |
| RBAC Security | **10 / 10 passing** |
| Input Validation | **5 / 5 passing** |
| PUT / Edit | **Passing** |
| Pagination + Search | **Passing** |
| Rate Limiting | **Passing** — triggers at attempt 3 → HTTP 429 |
| AI Forecast | **Passing** — ~3s first call, ~1s cached |
| CI / CD | **GitHub Actions** — test + build on every push |

<br/>

---

## 📖 About

**SynergyBeam ERP** is an original, fully custom-built business management system that unifies 13 modules — CRM, Inventory, Sales, Purchase, Accounting, HRMS, Projects, Assets, AI Forecasting, RFQ Management, Quotation Comparison, GST Invoices, and Activity Audit — into one web platform.

Built with a **3-tier role hierarchy** (Admin → Manager → Employee). Every role sees different pages, hits different API endpoints, and communicates through real approval workflows and a live notification system.

The **AI Forecasting module** uses Facebook Prophet trained on real `stock_movements` transaction data per SKU — not random numbers. Products with insufficient history get an honest "Insufficient data" message.

The **Procurement module** supports the full procurement lifecycle: create RFQ → invite vendors → collect quotations → compare side-by-side → select winner → auto-generate PO → issue GST invoice with CGST/SGST/IGST breakdown.

> ⚠️ **All code is original.** No code is copied from any other project.
> This project is proprietary — all rights reserved by Meet Adraja.

<br/>

---

## ✨ Modules

| Module | What it does | Roles |
| :--- | :--- | :--- |
| 🏠 **Dashboard** | Live KPIs, revenue charts, procurement metrics | All |
| 🤝 **CRM** | Customers and leads pipeline | Admin, Manager |
| 📦 **Inventory** | Products, stock, warehouses, movements | All |
| 🛍️ **Sales** | Orders and invoices | Admin, Manager |
| 🛒 **Purchase** | Suppliers and purchase orders | Admin, Manager |
| 💼 **Accounting** | Accounts, transactions, expenses | Admin |
| 👥 **HRMS** | Employees, attendance, leave approval | Admin, Manager |
| 🏗️ **Projects** | Projects and task management | All |
| 🖥️ **Assets** | Company asset registry | Admin, Manager |
| 📋 **RFQ Management** | Create RFQs, invite vendors, track responses | Admin, Manager |
| ⚖️ **Quotation Compare** | Side-by-side vendor price comparison | Admin, Manager |
| 🧾 **GST Invoices** | CGST/SGST/IGST invoices, auto tax calculation | Admin, Manager |
| 📜 **Activity Log** | Full audit trail of all system actions | Admin, Manager |
| 🤖 **AI Forecast** | Prophet + SKLearn on real stock history | Admin, Manager |
| 📊 **Reports** | Live charts + Excel / PDF export | Admin, Manager |
| 🔔 **Notifications** | Cross-role alerts and approvals | All |
| 🔐 **Users & Roles** | User management | Admin |

<br/>

---

## 👥 Roles & Permissions

| Feature | 👑 Admin | 🧑‍💼 Manager | 👤 Employee |
| :--- | :---: | :---: | :---: |
| Dashboard | ✅ | ✅ | ✅ |
| CRM | ✅ | ✅ | ❌ |
| Inventory (view) | ✅ | ✅ | ✅ |
| Sales | ✅ | ✅ | ❌ |
| Purchase | ✅ | ✅ | ❌ |
| Accounting | ✅ | ❌ | ❌ |
| HR — all staff | ✅ | ✅ | ❌ |
| HR — own leave | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ✅ |
| RFQ / Procurement | ✅ | ✅ | ❌ |
| GST Invoices | ✅ | ✅ | ❌ |
| AI Forecast | ✅ | ✅ | ❌ |
| Reports / Export | ✅ | ✅ | ❌ |
| Users & Roles | ✅ | ❌ | ❌ |
| Approve leave | ✅ | ✅ | ❌ |
| Approve PO | ✅ | ❌ | ❌ |
| Mark Invoice Paid | ✅ | ❌ | ❌ |

<br/>

---

## 🏗️ Architecture

```mermaid
graph TD
    classDef client fill:#0ea5e9,stroke:#0284c7,color:#fff
    classDef api fill:#10b981,stroke:#059669,color:#fff
    classDef svc fill:#6366f1,stroke:#4f46e5,color:#fff
    classDef db fill:#f59e0b,stroke:#d97706,color:#fff
    classDef ai fill:#ec4899,stroke:#db2777,color:#fff

    Browser["🌐 React 18 + Vite + TypeScript"]:::client
    Flask["⚡ Flask 3.0 REST API"]:::api

    Auth["🔐 JWT + RBAC"]:::svc
    CRUD["🏢 13 Module Blueprints"]:::svc
    Procure["📋 Procurement Workflow"]:::svc
    Dash["📊 Live Dashboard"]:::svc
    Export["📄 PDF + Excel"]:::svc
    AI["🧠 Prophet + SKLearn"]:::ai

    PG[("🐘 PostgreSQL")]:::db
    SQ[("📁 SQLite (dev)")]:::db

    Browser -->|"REST + Bearer JWT"| Flask
    Flask --> Auth
    Auth --> CRUD
    Auth --> Procure
    Auth --> Dash
    Flask --> Export
    Flask --> AI
    CRUD --> PG
    CRUD --> SQ
    Procure -->|"RFQ → Quote → PO → Invoice"| PG
    Dash -->|"COUNT/SUM aggregations"| PG
    AI -->|"stock_movements history"| PG
```

<br/>

---

## 📂 Project Structure

```
SynergyBeam-ERP/
│
├── backend/                        ← Python Flask REST API
│   ├── app.py                      App factory + blueprint registration
│   ├── config.py                   DB URI, JWT, env config
│   ├── extensions.py               Flask-Limiter setup
│   ├── requirements.txt
│   ├── Dockerfile
│   │
│   ├── ai_service/
│   │   └── forecaster.py           Prophet + SKLearn on real stock data
│   │
│   ├── models/                     SQLAlchemy ORM (one file per domain)
│   │   ├── user.py                 User + roles
│   │   ├── notification.py         Cross-role notifications
│   │   ├── crm.py                  Customer, Lead
│   │   ├── product.py              Product catalog
│   │   ├── inventory_models.py     Warehouse, StockMovement
│   │   ├── sales.py                SalesOrder, Invoice
│   │   ├── purchase.py             Supplier, PurchaseOrder
│   │   ├── hr.py                   Employee, Attendance, LeaveRequest
│   │   ├── accounting.py           Account, Transaction, Expense
│   │   ├── projects.py             Project, Task
│   │   ├── assets.py               Asset
│   │   └── rfq.py                  RFQ, Quotation, GSTInvoice, ActivityLog
│   │
│   ├── routes/                     Flask blueprints (one per module)
│   │   ├── auth.py                 Login, JWT, @token_required
│   │   ├── crud.py                 CRUD factory: paginated GET/POST/PUT/DELETE
│   │   ├── dashboard.py            Live KPI aggregations
│   │   ├── inventory.py            Products + stock endpoints
│   │   ├── hr.py                   HR + leave approval
│   │   ├── purchase.py             Purchase + PO approval
│   │   ├── rfq.py                  RFQ, quotations, GST invoices, activity log
│   │   ├── notifications.py        Notification endpoints
│   │   ├── forecast.py             AI forecast
│   │   └── export.py               PDF + Excel export
│   │
│   └── tests/                      pytest test suite
│       ├── conftest.py             Fixtures + in-memory SQLite
│       ├── test_auth.py
│       ├── test_crud.py
│       ├── test_dashboard.py
│       ├── test_forecast.py
│       └── test_validation.py
│
├── frontend/                       ← React SPA
│   └── src/
│       ├── components/
│       │   ├── resource-table.tsx  Shared table for all modules
│       │   ├── error-boundary.tsx  Global error boundary
│       │   ├── module-shell.tsx    Page headers, stat pills
│       │   └── app-sidebar.tsx     Role-filtered sidebar
│       ├── hooks/use-auth.tsx      JWT context + role helpers
│       ├── pages/                  One file per module
│       ├── types/index.ts          Shared TypeScript interfaces
│       └── services/api.ts         Axios + JWT interceptor
│
└── database/                       ← Schema + seed data
    ├── schema.sql                  PostgreSQL schema
    └── seed.sql                    Demo data + user accounts
```

> **3 folders, clean root.** `backend/` · `frontend/` · `database/`
> All config files, CI, Docker, and docs live at root level.

<br/>

---

## 🚀 Quick Start

### Prerequisites
**Python 3.10+** · **Node.js 18+** · **Git**

### Option A — Local (Windows)

```powershell
# Clone
git clone https://github.com/adrajameet7805/AI-Powered-ERP-System.git
cd AI-Powered-ERP-System

# Terminal 1 — Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
# ✅ http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# ✅ http://localhost:5173
```

### Option A — Local (Mac / Linux)

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

### Option B — Docker

```bash
docker-compose up --build
# ✅ UI at http://localhost:8080  |  API at http://localhost:5000
```

> **Important:** Always start the backend first. The frontend calls `localhost:5000` on every request.

<br/>

---

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

## ⚙️ Environment Variables

**`backend/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/synergybeam
SECRET_KEY=your-32-char-secret-key
JWT_SECRET_KEY=your-32-char-jwt-secret
FLASK_ENV=development
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

<br/>

---

## 🌐 API Reference

All endpoints except `/api/auth/login` and `/api/health` require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Paginated response format:**
```json
{ "data": [...], "total": 50, "page": 1, "pages": 2, "per_page": 50 }
```
Query params: `?page=1&per_page=25&search=keyword`

| Category | Endpoints |
| :--- | :--- |
| **Auth** | `POST /api/auth/login` · `GET /api/auth/users` |
| **Dashboard** | `GET /api/dashboard/kpis` · `revenue-chart` · `inventory-chart` · `activity-feed` |
| **CRM** | `/api/customers` · `/api/leads` |
| **Inventory** | `/api/inventory/products` |
| **Sales** | `/api/sales_orders` · `/api/invoices` |
| **Purchase** | `/api/suppliers` · `/api/purchase_orders` |
| **Accounting** | `/api/accounts` · `/api/transactions` · `/api/expenses` |
| **HR** | `/api/employees` · `/api/leave_requests` |
| **Projects** | `/api/projects` · `/api/tasks` |
| **Assets** | `/api/assets` |
| **Procurement** | `/api/rfqs` · `/api/vendor-quotations` · `/api/gst-invoices` · `/api/activity-logs` |
| **AI** | `GET /api/forecast/` |
| **Export** | `/api/export/excel/{crm\|inventory\|hrms\|accounting}` · `/api/export/pdf/{sales\|inventory\|financials}` |
| **System** | `GET /api/health` · `GET /api/notifications` |

All module endpoints support `GET / POST / PUT / DELETE`.

<br/>

---

## 🤖 AI Forecasting

```
1. Query real outbound stock_movements per SKU
2. < 14 days history → "Insufficient data" message
3. ≥ 14 days → Facebook Prophet fits time-series model
4. Predicts 30-day demand per SKU
5. Scikit-Learn classifies: OVERSTOCK / UNDERSTOCK / HEALTHY
6. Auto-creates notifications for Admin + Manager on critical SKUs
```

<br/>

---

## 📋 Procurement Workflow

```
Procurement Officer creates RFQ
        ↓  Vendors invited (from Suppliers list)
        ↓  Vendors submit quotations via Vendor Portal
        ↓  Manager compares quotations side-by-side
        ↓  Manager selects winning quotation
        ↓  System auto-generates Purchase Order
        ↓  Admin creates GST Invoice (CGST+SGST or IGST)
        ↓  Admin marks invoice as Paid
        ↓  ActivityLog records every step
```

<br/>

---

## 🧪 Tests

```bash
cd backend
pip install pytest pytest-flask pytest-cov
pytest tests/ -v
pytest tests/ --cov=. --cov-report=term-missing
```

<br/>

---

## 🔐 Security

- Scrypt password hashing (Werkzeug)
- JWT access tokens (1h) + refresh tokens (30d)
- RBAC via `@token_required(roles=[...])` — unauthorized → HTTP 403
- Frontend protected routes — restricted URLs show Access Denied
- SQLAlchemy ORM — no raw SQL, no injection risk
- Rate limiting — 5 req/min on login → HTTP 429
- CORS locked to `localhost:5173` and production domains

<br/>

---

## 🗺️ Roadmap

**Done ✅**
- [x] 24 API endpoints all passing
- [x] 3-tier RBAC enforced frontend + backend
- [x] Live dashboard from real DB
- [x] Full CRUD on all 13 modules
- [x] Paginated + searchable APIs
- [x] AI forecasting on real stock history
- [x] Full procurement workflow (RFQ → GST Invoice)
- [x] GST invoice with CGST/SGST/IGST auto-calculation
- [x] Activity audit log
- [x] PDF + Excel export
- [x] Rate limiting (HTTP 429)
- [x] Error boundary (no black screens)
- [x] Docker Compose
- [x] GitHub Actions CI
- [x] Dark / Light theme

**Planned 🔧**
- [ ] Frontend test packages install (vitest + RTL)
- [ ] Suppress Prophet/plotly warning
- [ ] HTTPS + production CORS

<br/>

---

## ❓ Troubleshooting

| Problem | Fix |
| :--- | :--- |
| Black screen | Start backend first, then frontend |
| `.map is not a function` | API returns `{ data: [] }` — use `res.data?.data` not `res.data` |
| `401 Unauthorized` | JWT expired — log out and log in again |
| `403 Forbidden` | Wrong role for that endpoint |
| AI forecast slow first call | Normal — Prophet cold start ~3s, cached after |
| `source` not recognized (Windows) | Use `venv\Scripts\activate` not `source venv/bin/activate` |
| Port 5173 in use | Frontend will auto-use 5174 — this is fine |

<br/>

---

<div align="center">

## 👨‍💻 Author

**Meet Adraja** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-%40adrajameet7805-181717?style=flat-square&logo=github)](https://github.com/adrajameet7805)

*© 2026 Meet Adraja. All rights reserved.*
*If this helped you, please give it a ⭐*

</div>
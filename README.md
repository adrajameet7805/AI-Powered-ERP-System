<div align="center">

<br/>

# ⚡ SynergyBeam ERP

**An AI-powered Enterprise Resource Planning system built with React, Flask, and Facebook Prophet.**

[![Version](https://img.shields.io/badge/Version-1.0.0-blueviolet?style=for-the-badge&logo=github)](https://github.com/adrajameet7805)
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
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=20&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=650&lines=9+Integrated+Business+Modules;AI+Demand+Forecasting+with+Prophet;Role-Based+Access+%E2%80%94+Admin+%7C+Manager+%7C+Employee;React+%2B+Flask+%2B+PostgreSQL+%2B+Docker" alt="Typing SVG" />
</a>

<br/>


</div>

<br/>

---

<br/>

## 📖 About

**SynergyBeam ERP** is a full-stack business management system that unifies 9 core business departments — CRM, Inventory, Sales, Purchase, Accounting, HR, Projects, Assets, and AI Forecasting — into a single web application.

Built on a clean client-server architecture: a **React + TypeScript** frontend communicates with a **Python Flask** REST API via JWT-authenticated requests. Data is stored in **SQLite** for local development and **PostgreSQL** for production, managed through SQLAlchemy ORM.

The system implements a **3-tier role hierarchy** (Admin → Manager → Employee) where each role sees different pages, has different permissions, and communicates with other roles through a real-time notification and approval workflow — the same pattern used in enterprise ERP systems like SAP and ERPNext.

The standout technical feature is the **AI Forecasting module**, which uses Facebook Prophet (time-series ML) and Scikit-Learn to predict future product demand per SKU and generate reorder recommendations automatically.

> This project was built as a college capstone to demonstrate full-stack engineering: REST API design, relational database modeling, JWT + RBAC security, Docker deployment, and applied machine learning.

<br/>

---

<br/>

## ✨ Modules

| Module | What it does | Who can access |
| :--- | :--- | :--- |
| 🏠 **Dashboard** | Live KPI cards, revenue charts, activity feed | All roles |
| 🤝 **CRM** | Customers and leads across a sales pipeline | Admin, Manager |
| 📦 **Inventory** | Products, stock levels, warehouse movements | All roles |
| 🛍️ **Sales** | Sales orders and invoices | Admin, Manager |
| 🛒 **Purchase** | Suppliers and purchase orders with approval flow | Admin, Manager |
| 💼 **Accounting** | Accounts, transactions, expenses | Admin only |
| 👥 **HRMS** | Employees, attendance, leave requests + approval | Admin, Manager |
| 🏗️ **Projects** | Projects and task management | All roles |
| 🖥️ **Assets** | Company asset registry and depreciation | Admin, Manager |
| 🤖 **AI Forecast** | Prophet + Scikit-Learn demand forecasting per SKU | Admin, Manager |
| 📊 **Reports** | Export any module to PDF or Excel (.xlsx) | Admin, Manager |
| 🔔 **Notifications** | Cross-role alerts, approvals, system messages | All roles |
| 🔐 **Users & Roles** | User management and role assignment | Admin only |

<br/>

---

<br/>

## 👥 Role-Based Access Control

SynergyBeam has a 3-tier role hierarchy. Each role has different page access, API permissions, and workflow responsibilities.

### Role Permissions at a Glance

| Feature | 👑 Admin | 🧑‍💼 Manager | 👤 Employee |
| :--- | :---: | :---: | :---: |
| Dashboard | ✅ | ✅ | ✅ |
| CRM | ✅ | ✅ | ❌ |
| Inventory | ✅ | ✅ | ✅ (view) |
| Sales | ✅ | ✅ | ❌ |
| Purchase | ✅ | ✅ | ❌ |
| Accounting | ✅ | ❌ | ❌ |
| HR (all staff) | ✅ | ✅ | ❌ |
| HR (own leave) | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ✅ |
| Assets | ✅ | ✅ | ❌ |
| AI Forecasting | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ✅ |
| Users & Roles | ✅ | ❌ | ❌ |
| Approve leave | ✅ | ✅ | ❌ |
| Approve PO | ✅ | ❌ | ❌ |

### Cross-Role Workflows

**Leave Request Flow:**
```
Employee submits leave request
        ↓
Manager sees pending request in HR module
        ↓
Manager clicks Approve or Reject
        ↓
Employee receives notification with decision
```

**Purchase Order Flow:**
```
Manager creates a Purchase Order (status: pending)
        ↓
Admin sees pending PO in Purchase module
        ↓
Admin clicks Approve
        ↓
PO status changes to approved
Manager receives notification
```

**AI Inventory Alert Flow:**
```
AI Forecast runs and detects low stock
        ↓
Notification sent to Admin + Manager
        ↓
Manager creates a Purchase Order
        ↓
Admin approves it
```

### Role-Based Sidebar

Every user sees only the pages their role allows. Typing a restricted URL directly in the browser shows an **Access Denied** page — not just hidden from the menu.

Role badges in the top navigation bar are color-coded:
- 🔴 **Admin** — red badge
- 🔵 **Manager** — blue badge  
- 🟢 **Employee** — green badge

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

    Browser["🌐 Browser — React 18 + Vite + TypeScript"]:::client
    Flask["⚡ Flask REST API — Python 3.10+"]:::api

    Auth["🔐 JWT Auth + RBAC Middleware"]:::service
    CRUD["🏢 9 ERP Module Blueprints"]:::service
    Workflow["🔄 Approval Workflows"]:::service
    Export["📄 PDF + Excel Export Engine"]:::service
    AI["🧠 Prophet + Scikit-Learn AI"]:::ai

    PG[("🐘 PostgreSQL — Production")]:::db
    SQ[("📁 SQLite — Development")]:::db

    Browser -->|"REST API + Bearer JWT"| Flask
    Flask --> Auth
    Auth -->|"Role check on every request"| CRUD
    Auth -->|"Role check on every request"| Workflow
    Flask --> Export
    Flask --> AI
    CRUD --> PG
    CRUD --> SQ
    Workflow -->|"Writes notifications"| PG
    AI -->|"Reads product & stock data"| PG
```

**Key architectural patterns:**

- **CRUD Factory** — `backend/routes/crud.py` auto-generates GET, POST, DELETE endpoints for every module. Adding a new module is one line of code.
- **Role-gated endpoints** — every backend endpoint passes an explicit `roles` list to the `@token_required` decorator. Unauthorized roles get HTTP 403.
- **Shared ResourceTable** — `frontend/src/components/resource-table.tsx` renders every module's data table, search, and actions. All 9 pages share it.
- **JWT interceptor** — Axios attaches the Bearer token automatically to every request. Token expiry triggers an automatic refresh.
- **Notification model** — a dedicated `notifications` table stores cross-role messages with `recipient_role` field so each role only sees their own alerts.

<br/>

---

<br/>

## 🛠️ Tech Stack

<details open>
<summary><b>🎨 Frontend</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework + fast dev server with HMR |
| TypeScript | Type safety across all components |
| Tailwind CSS v4 | Utility-first styling |
| ShadCN UI + Radix UI | Accessible, unstyled component primitives |
| TanStack React Query v5 | Server state, caching, background refetching |
| React Router v6 | Client-side routing with protected routes |
| Recharts | Interactive charts on the dashboard |
| Axios | HTTP client with automatic JWT Bearer injection |
| Lucide React | Icon library |

</details>

<details open>
<summary><b>⚙️ Backend</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Python 3.10+ + Flask 3.0 | REST API framework |
| SQLAlchemy | ORM — no raw SQL anywhere in the codebase |
| PostgreSQL 15 | Production relational database |
| SQLite | Zero-config local development fallback |
| PyJWT | JWT token generation, validation, role extraction |
| Werkzeug.security | Scrypt password hashing (never plaintext) |
| Flask-CORS | Cross-origin request handling |
| ReportLab | PDF generation for report exports |
| OpenPyXL | Excel (.xlsx) generation for report exports |

</details>

<details open>
<summary><b>🧠 AI & Data Science</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Facebook Prophet | Time-series demand forecasting per product SKU |
| Scikit-Learn | Anomaly detection, overstock/understock classification |
| Pandas | Data aggregation and manipulation |
| NumPy | Numerical operations |

</details>

<details open>
<summary><b>🐳 DevOps</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Docker | Container for Flask backend |
| Docker Compose | Orchestrates Flask + React + PostgreSQL together |
| GitHub | Version control and code hosting |

</details>

<br/>

---

<br/>

## 📂 Project Structure

```
AI-Powered-ERP-System/
│
├── backend/                        # Python Flask REST API
│   ├── app.py                      # App factory — registers all blueprints
│   ├── config.py                   # DB URI, JWT secrets, environment config
│   ├── requirements.txt            # Python dependencies
│   │
│   ├── ai_service/
│   │   └── forecaster.py           # Prophet + Scikit-Learn forecasting engine
│   │
│   ├── models/                     # SQLAlchemy ORM models
│   │   ├── user.py                 # User accounts + roles
│   │   ├── notification.py         # Cross-role notification model
│   │   ├── crm.py                  # Customer, Lead
│   │   ├── product.py              # Product catalog
│   │   ├── inventory_models.py     # Warehouse, StockMovement
│   │   ├── sales.py                # SalesOrder, Invoice
│   │   ├── purchase.py             # Supplier, PurchaseOrder
│   │   ├── hr.py                   # Employee, Attendance, LeaveRequest
│   │   ├── accounting.py           # Account, Transaction, Expense
│   │   ├── projects.py             # Project, Task
│   │   └── assets.py               # Asset
│   │
│   └── routes/                     # Flask blueprints
│       ├── auth.py                 # Login, JWT, @token_required decorator
│       ├── crud.py                 # Generic CRUD factory (role-aware)
│       ├── hr.py                   # HR routes + leave approval endpoint
│       ├── purchase.py             # Purchase routes + PO approval endpoint
│       ├── inventory.py            # Product-specific endpoints
│       ├── forecast.py             # AI demand forecasting
│       └── export.py               # PDF + Excel export
│
├── frontend/                       # React SPA
│   └── src/
│       ├── components/
│       │   ├── resource-table.tsx  # Shared table — used by all module pages
│       │   ├── module-shell.tsx    # PageHeader, StatPill, StatusBadge
│       │   └── app-sidebar.tsx     # Role-filtered navigation sidebar
│       ├── hooks/
│       │   └── use-auth.tsx        # JWT auth context + role helpers
│       ├── pages/
│       │   ├── dashboard.tsx       # KPI cards + Recharts graphs
│       │   ├── crm.tsx             # Customers + Leads
│       │   ├── inventory.tsx       # Products + Stock
│       │   ├── sales.tsx           # Orders + Invoices
│       │   ├── purchase.tsx        # Suppliers + POs + Admin approval
│       │   ├── accounting.tsx      # Accounts + Transactions (Admin only)
│       │   ├── hr.tsx              # Employees + Leave + Manager approval
│       │   ├── projects.tsx        # Projects + Tasks
│       │   ├── assets.tsx          # Asset registry
│       │   ├── ai-forecast.tsx     # AI demand predictions per SKU
│       │   ├── reports.tsx         # PDF/Excel export UI
│       │   ├── notifications.tsx   # Role-filtered notification center
│       │   └── users.tsx           # User management (Admin only)
│       └── services/
│           └── api.ts              # Axios instance with JWT interceptor
│
├── database/
│   ├── schema.sql                  # Full PostgreSQL schema
│   └── seed.sql                    # Demo data + default user accounts
│
└── docker-compose.yml              # Flask + React + PostgreSQL stack
```

<br/>

---

<br/>

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **Python** 3.10+
- **Git**

---

### Option A — Local Development (Recommended)

**Step 1 — Clone**
```bash
git clone https://github.com/adrajameet7805/AI-Powered-ERP-System.git
cd AI-Powered-ERP-System
```

**Step 2 — Start the backend**
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
> ✅ API running at `http://localhost:5000`
> SQLite database is created automatically on first run.

**Step 3 — Start the frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```
> ✅ UI running at `http://localhost:5173`

---

### Option B — Docker (Full Stack with PostgreSQL)

```bash
docker-compose up --build
```
> ✅ UI at `http://localhost:8080` &nbsp;|&nbsp; API at `http://localhost:5000`
> PostgreSQL is seeded automatically from `database/seed.sql`

<br/>

---

<br/>

## 🔑 Default Login Credentials

> [!CAUTION]
> Change all passwords immediately before any public or production deployment.

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@synergybeam.com` | `Admin@123` | Full system access |
| 🧑‍💼 **Manager** | `manager@synergybeam.com` | `Admin@123` | Operations + approvals |
| 👤 **Employee** | `employee@synergybeam.com` | `Admin@123` | Self-service only |

**Test the role system:**
1. Log in as **Employee** — you will see only Dashboard, Inventory, Projects, Notifications
2. Try typing `/accounting` in the URL — you get an Access Denied page
3. Submit a leave request as Employee
4. Log out, log in as **Manager** — you will see the pending leave request in HR
5. Approve it — the Employee's notification center shows the decision
6. Log in as **Admin** — you see everything including Accounting and Users & Roles

<br/>

---

<br/>

## ⚙️ Environment Variables

**backend/.env**
```env
# Leave blank to use SQLite locally
DATABASE_URL=postgresql://user:password@localhost:5432/synergybeam

# Generate random 32-char strings for production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

FLASK_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit `.env` files. Both are in `.gitignore`.

<br/>

---

<br/>

## 🤖 How AI Forecasting Works

When you open the **AI Forecast** module or call `GET /api/forecast/`:

```
1. Backend queries every product in the database
         ↓
2. Builds sales history dataset per product SKU
         ↓
3. Facebook Prophet fits a time-series model on the history
         ↓
4. Prophet predicts demand for next 30 days
         ↓
5. Scikit-Learn classifies each product:
   OVERSTOCK → current stock >> forecasted demand
   UNDERSTOCK → current stock << forecasted demand
   HEALTHY → within safe range
         ↓
6. System generates plain-English recommendation per product:
   "Forecasted demand: 120 units. Stock: 30. Reorder 90 units urgently."
   "Forecasted demand: 15 units. Stock: 200. Overstock — hold purchasing."
         ↓
7. Critical alerts auto-create notifications for Admin + Manager
```

> **Note:** Current implementation trains on simulated sales history.
> A planned improvement will wire this to real `stock_movements` transaction data.

<br/>

---

<br/>

## 🌐 API Reference

All endpoints except `/api/auth/login` and `/api/health` require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Auth**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Returns `access_token` + `refresh_token` |
| `POST` | `/api/auth/refresh` | Public | Exchange refresh token for new access token |
| `GET` | `/api/auth/users` | Admin | List all users and roles |
| `GET` | `/api/health` | Public | Health check |

**ERP Modules**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET/POST` | `/api/customers` | Admin, Manager | Customers list / create |
| `GET/POST` | `/api/leads` | Admin, Manager | Leads list / create |
| `GET/POST` | `/api/inventory/products` | All | Products list / create |
| `GET/POST` | `/api/sales_orders` | Admin, Manager | Sales orders |
| `GET/POST` | `/api/invoices` | Admin, Manager | Invoices |
| `GET/POST` | `/api/purchase_orders` | Admin, Manager | Purchase orders |
| `GET/POST` | `/api/employees` | Admin, Manager | Employees |
| `GET/POST` | `/api/leave_requests` | All | Leave requests |
| `GET/POST` | `/api/projects` | All | Projects |
| `GET/POST` | `/api/assets` | Admin, Manager | Assets |

**Workflows**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `PATCH` | `/api/leave_requests/<id>/status` | Admin, Manager | Approve or reject leave |
| `PATCH` | `/api/purchase_orders/<id>/approve` | Admin | Approve a purchase order |

**Notifications**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | All | Get notifications for current role |
| `POST` | `/api/notifications` | Admin, Manager | Create notification |
| `PATCH` | `/api/notifications/<id>` | All | Mark as read |
| `DELETE` | `/api/notifications/<id>` | Admin | Delete notification |

**AI + Export**

| Method | Endpoint | Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/forecast/` | Admin, Manager | Run AI demand forecast |
| `GET` | `/api/export/excel/<module>` | Admin, Manager | Download Excel export |
| `GET` | `/api/export/pdf/<module>` | Admin, Manager | Download PDF export |

**Quick test:**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@synergybeam.com","password":"Admin@123"}'

# Use the token
curl http://localhost:5000/api/forecast/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

<br/>

---

<br/>

## 🔐 Security

- **Password hashing** — Werkzeug's scrypt algorithm. Never stored as plaintext.
- **JWT authentication** — Short-lived access tokens (1 hour) + 30-day refresh tokens.
- **Role-based access control** — Every backend endpoint declares allowed roles explicitly via `@token_required(roles=[...])`. Unauthorized roles return HTTP 403.
- **Frontend route protection** — Direct URL access to restricted pages shows an Access Denied screen — roles aren't just hidden from the menu.
- **SQL injection prevention** — All database queries go through SQLAlchemy ORM. No raw SQL strings anywhere.
- **CORS** — Configured via Flask-CORS.

**Known limitations (planned improvements):**
- Rate limiting on login endpoint not yet implemented
- CORS currently allows all origins (restrict to frontend URL in production)
- No HTTPS enforcement in development mode

<br/>

---

<br/>

## ❓ Troubleshooting

<details>
<summary><b>Frontend shows "Failed to fetch" errors</b></summary>

The Flask backend must be running first, before you start the frontend.

```bash
# Terminal 1
cd backend && python app.py

# Terminal 2
cd frontend && npm run dev
```

Also check nothing else is using port 5000.
</details>

<details>
<summary><b>API returns 401 Unauthorized</b></summary>

Your JWT has expired (default: 1 hour). Log out and log back in. The frontend handles token refresh automatically — if you still see 401 in the UI after re-logging, clear localStorage and try again.
</details>

<details>
<summary><b>API returns 403 Forbidden</b></summary>

You are logged in as a role that does not have access to that endpoint. For example, an Employee trying to access `/api/accounting` will get 403. Log in with the correct role (Admin for accounting).
</details>

<details>
<summary><b>Backend crash: "No module named prophet"</b></summary>

Your virtual environment is not activated or dependencies were not installed.

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python app.py
```

> Always create a fresh `venv` — never reuse the one that may have been committed to the repo, as it was built for a different OS.
</details>

<details>
<summary><b>Docker build is slow or fails</b></summary>

Make sure `backend/.dockerignore` exists:
```
venv/
__pycache__/
*.pyc
*.db
```

Without this, Docker tries to copy the entire `venv/` folder (400MB+) into the container.
</details>

<br/>

---

<br/>

## 🗺️ Roadmap

**Completed**
- [x] 9-module ERP with unified dashboard
- [x] JWT authentication with access + refresh tokens
- [x] 3-tier RBAC — Admin / Manager / Employee
- [x] Role-filtered sidebar and protected route pages
- [x] Leave request approval workflow (Employee → Manager → notification)
- [x] Purchase order approval workflow (Manager → Admin → notification)
- [x] Cross-role notification center
- [x] Generic CRUD factory (one function generates all module endpoints)
- [x] Facebook Prophet + Scikit-Learn AI forecasting engine
- [x] PDF and Excel export for all modules
- [x] Docker Compose deployment
- [x] Dark / Light theme toggle

**Planned**
- [ ] Live dashboard KPI cards connected to real database aggregations
- [ ] AI forecasting wired to real stock movement transaction history
- [ ] Edit (PUT/PATCH) endpoints for all records
- [ ] Pagination and search on all list endpoints
- [ ] Input validation on all create/update endpoints
- [ ] Unit and integration tests (pytest + Vitest)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Mobile-responsive layout improvements

<br/>

---

<br/>

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Follow **PEP8** for Python, **ESLint/Prettier** for TypeScript
4. Test your changes:
```bash
# Backend health
curl http://localhost:5000/api/health

# Test all 3 roles
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@synergybeam.com","password":"Admin@123"}'
```
5. Open a pull request with a clear description of your changes

<br/>

---

<br/>

## 📜 License

Released under the **MIT License**. Free to use, modify, and distribute with attribution.

<br/>

---

<br/>

<div align="center">

### 👨‍💻 Built by

**Meet Adraja**
*Full-Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-%40adrajameet7805-181717?style=flat-square&logo=github)](https://github.com/adrajameet7805)

*If this project helped you, consider giving it a ⭐*

</div>
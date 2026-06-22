<div align="center">

<br/>

# ⚡ SynergyBeam ERP

**An AI-powered Enterprise Resource Planning system — built with React, Flask, and Facebook Prophet.**

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

**[Quick Start](#-quick-start) • [Modules](#-modules) • [API Reference](#-api-reference) • [Deployment](#-deployment)**

<br/>

<a href="https://github.com/adrajameet7805/AI-Powered-ERP-System">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=20&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=600&lines=9+Integrated+Business+Modules;AI+Demand+Forecasting+with+Prophet;React+%2B+Flask+%2B+PostgreSQL+%2B+Docker" alt="Typing SVG" />
</a>

<br/>


</div>

<br/>

---

<br/>

## 📖 About

**SynergyBeam ERP** is a full-stack business management system that unifies 9 core departments — CRM, Inventory, Sales, Purchase, Accounting, HR, Projects, Assets, and AI Forecasting — into a single web application.

The project is built on a clean client-server architecture: a **React + TypeScript** frontend communicates with a **Python Flask** REST API backend via JWT-authenticated requests. Data is stored in **SQLite** for local development and **PostgreSQL** for production, managed through SQLAlchemy ORM.

The standout feature is the **AI Forecasting module**, which uses Facebook Prophet (time-series ML) and Scikit-Learn to predict future product demand per SKU and automatically generate reorder recommendations — the same class of technology used by large e-commerce platforms for inventory optimization.

This project was built as a college capstone to demonstrate end-to-end full-stack engineering: REST API design, relational database modeling, JWT authentication, Docker deployment, and applied machine learning.

<br/>

---

<br/>

## ✨ Modules

| Module | What it does |
| :--- | :--- |
| 🤝 **CRM** | Manage customers and leads across a full sales pipeline |
| 📦 **Inventory** | Track products, stock levels, warehouses, and movements |
| 🛍️ **Sales** | Create and manage sales orders and invoices |
| 🛒 **Purchase** | Manage suppliers and purchase orders |
| 💼 **Accounting** | Track accounts, transactions, and expenses |
| 👥 **HRMS** | Employee records, attendance tracking, and leave requests |
| 🏗️ **Projects** | Project and task management with status tracking |
| 🖥️ **Assets** | Register and track company assets and depreciation |
| 🤖 **AI Forecast** | Prophet + Scikit-Learn demand forecasting per product SKU |
| 📊 **Reports** | Export any module's data to PDF or Excel (.xlsx) |

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

    Auth["🔐 JWT Auth + RBAC"]:::service
    CRUD["🏢 9 ERP Module Blueprints"]:::service
    Export["📄 PDF + Excel Export Engine"]:::service
    AI["🧠 Prophet + Scikit-Learn AI"]:::ai

    PG[("🐘 PostgreSQL — Production")]:::db
    SQ[("📁 SQLite — Development")]:::db

    Browser -->|"REST API + Bearer JWT"| Flask
    Flask --> Auth
    Flask --> CRUD
    Flask --> Export
    Flask --> AI
    CRUD --> PG
    CRUD --> SQ
    AI -->|"Reads product & stock history"| PG
```

**Key architectural decisions:**

- **CRUD Factory pattern** — `backend/routes/crud.py` auto-generates GET, POST, and DELETE endpoints for every module from a single reusable function. Adding a new module requires registering one line.
- **Shared ResourceTable component** — `frontend/src/components/resource-table.tsx` is a single React component that renders every module's data table, search, and actions. All 9 module pages use it.
- **JWT interceptor** — Axios is configured once in `services/api.ts`. Every API call automatically attaches the Bearer token from localStorage. Token expiry triggers an automatic refresh.

<br/>

---

<br/>

## 🛠️ Tech Stack

<details open>
<summary><b>🎨 Frontend</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework + lightning-fast dev server |
| TypeScript | Type safety across all components |
| Tailwind CSS v4 | Utility-first styling |
| ShadCN UI + Radix UI | Accessible component primitives |
| TanStack React Query v5 | Server state, caching, background refetching |
| React Router v6 | Client-side routing |
| Recharts | Interactive data charts on the dashboard |
| Axios | HTTP client with JWT interceptor |
| Lucide React | Icon library |

</details>

<details open>
<summary><b>⚙️ Backend</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Python 3.10+ + Flask 3.0 | REST API framework |
| SQLAlchemy | ORM — no raw SQL anywhere |
| PostgreSQL 15 | Production database |
| SQLite | Zero-config local development database |
| PyJWT | JWT token generation and validation |
| Werkzeug.security | Scrypt password hashing |
| Flask-CORS | Cross-origin request handling |
| ReportLab | PDF generation |
| OpenPyXL | Excel (.xlsx) generation |

</details>

<details open>
<summary><b>🧠 AI & Data Science</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Facebook Prophet | Time-series demand forecasting per SKU |
| Scikit-Learn | Anomaly detection and overstock classification |
| Pandas | Data manipulation and aggregation |
| NumPy | Numerical operations |

</details>

<details open>
<summary><b>🐳 DevOps</b></summary>
<br/>

| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Containerized deployment (Flask + React + PostgreSQL) |
| GitHub | Version control |

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
│   ├── config.py                   # DB URI, JWT config, environment settings
│   ├── requirements.txt            # Python dependencies
│   │
│   ├── ai_service/
│   │   └── forecaster.py           # Prophet + Scikit-Learn forecasting engine
│   │
│   ├── models/                     # SQLAlchemy ORM models (one file per domain)
│   │   ├── user.py                 # User, roles
│   │   ├── crm.py                  # Customer, Lead
│   │   ├── product.py              # Product (inventory catalog)
│   │   ├── inventory_models.py     # Warehouse, StockMovement
│   │   ├── sales.py                # SalesOrder, Invoice
│   │   ├── purchase.py             # Supplier, PurchaseOrder
│   │   ├── hr.py                   # Employee, Attendance, LeaveRequest
│   │   ├── accounting.py           # Account, Transaction, Expense
│   │   ├── projects.py             # Project, Task
│   │   └── assets.py               # Asset
│   │
│   └── routes/                     # Flask blueprints (one per module)
│       ├── auth.py                 # Login, JWT generation, @token_required decorator
│       ├── crud.py                 # Generic CRUD factory — GET/POST/DELETE for all modules
│       ├── inventory.py            # Product-specific endpoints
│       ├── forecast.py             # AI demand forecasting endpoint
│       └── export.py               # PDF + Excel export endpoints
│
├── frontend/                       # React SPA
│   └── src/
│       ├── components/
│       │   ├── resource-table.tsx  # Shared table used by all 9 module pages
│       │   ├── module-shell.tsx    # Page header, stat pills, status badges
│       │   └── app-sidebar.tsx     # Navigation sidebar
│       ├── hooks/
│       │   └── use-auth.tsx        # JWT auth context
│       ├── pages/                  # One file per module
│       │   ├── dashboard.tsx       # KPI cards + Recharts graphs
│       │   ├── crm.tsx             # Customers + Leads
│       │   ├── inventory.tsx       # Products + Stock
│       │   ├── sales.tsx           # Orders + Invoices
│       │   ├── purchase.tsx        # Suppliers + POs
│       │   ├── accounting.tsx      # Accounts + Transactions
│       │   ├── hr.tsx              # Employees + Leave
│       │   ├── projects.tsx        # Projects + Tasks
│       │   ├── assets.tsx          # Asset registry
│       │   ├── ai-forecast.tsx     # AI demand predictions
│       │   └── reports.tsx         # PDF/Excel export UI
│       └── services/
│           └── api.ts              # Axios instance with JWT interceptor
│
├── database/
│   ├── schema.sql                  # Full PostgreSQL schema (used by Docker)
│   └── seed.sql                    # Demo data + default user accounts
│
└── docker-compose.yml              # Spins up Flask + React + PostgreSQL together
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

**Step 1 — Clone the repo**
```bash
git clone https://github.com/adrajameet7805/AI-Powered-ERP-System.git
cd AI-Powered-ERP-System
```

**Step 2 — Start the backend**
```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

> ✅ API is running at `http://localhost:5000`
> The SQLite database (`synergybeam.db`) is created automatically on first run.

**Step 3 — Start the frontend** (open a new terminal)
```bash
cd frontend
npm install
npm run dev
```

> ✅ UI is running at `http://localhost:5173`

**Step 4 — Log in**

Open `http://localhost:5173` in your browser and use any of the default accounts below.

---

### Option B — Docker (Full Stack with PostgreSQL)

```bash
docker-compose up --build
```

This spins up three containers: React frontend, Flask backend, and PostgreSQL database. The database is seeded automatically from `database/seed.sql`.

> ✅ UI at `http://localhost:8080` &nbsp;|&nbsp; API at `http://localhost:5000`

<br/>

---

<br/>

## 🔑 Default Login Credentials

> [!CAUTION]
> Change these immediately before any public or production deployment.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@synergybeam.com` | `Admin@123` |
| **Manager** | `manager@synergybeam.com` | `Admin@123` |
| **Employee** | `employee@synergybeam.com` | `Admin@123` |

<br/>

---

<br/>

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# Database — leave blank to auto-use SQLite locally
DATABASE_URL=postgresql://user:password@localhost:5432/synergybeam

# Security — use a random 32-character string in production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# Environment
FLASK_ENV=development
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit `.env` files. Both are listed in `.gitignore`.

<br/>

---

<br/>

## 🌐 API Reference

All endpoints except `/api/auth/login` and `/api/health` require a `Bearer` JWT token in the `Authorization` header.

**Authentication**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login — returns `access_token` + `refresh_token` |
| `GET` | `/api/auth/users` | List all users |
| `GET` | `/api/health` | Health check — no auth required |

**CRM**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/customers` | List all customers |
| `POST` | `/api/customers` | Create a customer |
| `DELETE` | `/api/customers/<id>` | Delete a customer |
| `GET` | `/api/leads` | List all leads |
| `POST` | `/api/leads` | Create a lead |

**Inventory**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/inventory/products` | List all products with stock levels |
| `POST` | `/api/inventory/products` | Add a new product |
| `DELETE` | `/api/inventory/products/<id>` | Delete a product |

**Sales**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/sales_orders` | List all sales orders |
| `POST` | `/api/sales_orders` | Create a sales order |
| `GET` | `/api/invoices` | List all invoices |
| `POST` | `/api/invoices` | Create an invoice |

**AI Forecasting**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/forecast/` | Run demand forecast for all products |

**Export**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/export/excel/<module>` | Download Excel export for any module |
| `GET` | `/api/export/pdf/<module>` | Download PDF export for any module |

**Example — Login and call a protected endpoint:**

```bash
# 1. Login and get your token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@synergybeam.com","password":"Admin@123"}'

# 2. Use the token
curl http://localhost:5000/api/inventory/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

<br/>

---

<br/>

## 🔐 Security

- **Password hashing** — Werkzeug's scrypt algorithm. Passwords are never stored in plaintext.
- **JWT authentication** — Short-lived access tokens (1 hour) + 30-day refresh tokens.
- **Role-based access control** — Every protected endpoint uses a `@token_required` decorator that validates the token and checks the user's role (Admin / Manager / Employee).
- **SQL injection prevention** — All queries go through SQLAlchemy ORM. No raw SQL strings anywhere in the codebase.
- **CORS** — Configured via Flask-CORS.

**Known limitations (planned):**
- Rate limiting on login endpoint not yet implemented
- CORS currently allows all origins — should be restricted to frontend URL in production

<br/>

---

<br/>

## 🤖 How the AI Forecasting Works

When you open the **AI Forecast** module or call `GET /api/forecast/`:

1. The backend queries every product in the database
2. For each product, it builds a sales history dataset
3. That dataset is passed to **Facebook Prophet** — a time-series forecasting model — which predicts demand for the next 30 days
4. **Scikit-Learn** classifies each product as overstock, understock, or healthy based on the forecast vs current stock
5. The system generates a plain-English recommendation per product:
   - *"Forecasted demand: 120 units. Current stock: 30. Reorder 90 units urgently."*
   - *"Forecasted demand: 15 units. Current stock: 200. Overstock — hold purchasing."*

> **Note:** The current implementation uses simulated sales history for training. A future improvement will wire this to real `stock_movements` transaction data from the database.

<br/>

---

<br/>

## 🗺️ Roadmap

**Completed**
- [x] 9-module ERP architecture with unified dashboard
- [x] JWT authentication + 3-tier RBAC (Admin / Manager / Employee)
- [x] Generic CRUD factory — GET, POST, DELETE for all modules
- [x] Facebook Prophet + Scikit-Learn AI forecasting engine
- [x] PDF and Excel export for all modules
- [x] Docker Compose deployment (Flask + React + PostgreSQL)
- [x] Dark / Light theme toggle

**In Progress / Planned**
- [ ] PUT/PATCH endpoints — edit existing records (no edit functionality yet)
- [ ] Connect dashboard KPI cards to live database data
- [ ] Wire AI forecasting to real stock movement transaction history
- [ ] Pagination and search on all list endpoints
- [ ] Input validation on all create/update endpoints
- [ ] Rate limiting on authentication endpoints
- [ ] Unit and integration tests (pytest + Vitest)
- [ ] CI/CD pipeline with GitHub Actions

<br/>

---

<br/>

## ❓ Troubleshooting

<details>
<summary><b>Frontend shows "Failed to fetch" or network errors</b></summary>

The Flask backend must be running before you start the frontend.

```bash
# Terminal 1 — start backend first
cd backend && python app.py

# Terminal 2 — then start frontend
cd frontend && npm run dev
```

Also check that no other process is using port 5000.
</details>

<details>
<summary><b>API returns 401 Unauthorized</b></summary>

Your JWT token has expired (default: 1 hour) or was not included.

1. Log in again at `POST /api/auth/login` to get a new token
2. Include it in all requests: `Authorization: Bearer YOUR_TOKEN`
3. The frontend handles this automatically — if you see 401 errors in the UI, log out and log back in.
</details>

<details>
<summary><b>Backend crashes with "No module named prophet" or similar</b></summary>

The virtual environment is not activated, or dependencies were not installed.

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
python app.py
```

> Do not use the `venv/` folder from the repository directly — it was built for a different OS. Always create a fresh one with `python -m venv venv`.
</details>

<details>
<summary><b>Docker build is very slow or fails</b></summary>

Make sure `backend/.dockerignore` exists and contains:

```
venv/
fresh_venv/
__pycache__/
*.pyc
*.db
```

Without this file, Docker tries to copy the entire `venv/` folder (400MB+) into the container, which causes slow builds or failures.
</details>

<br/>

---

<br/>

## 🤝 Contributing

Pull requests are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow **PEP8** for Python and **ESLint/Prettier** for TypeScript
4. Test your changes:
   ```bash
   # Verify backend health
   curl http://localhost:5000/api/health

   # Verify login works
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@synergybeam.com","password":"Admin@123"}'
   ```
5. Submit a pull request with a clear description of the change

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
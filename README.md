<div align="center">
  <img src="screenshots/logo.png" alt="SynergyBeam ERP Logo" width="120" />

  # AI-Powered Enterprise Resource Planning (ERP) System
  
  **An intelligent, standalone, and highly scalable ERP system inspired by ERPNext.**  
  *Built with React, Vite, Tailwind CSS, Python Flask, and Scikit-Learn.*

  [![React](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Flask](https://img.shields.io/badge/Flask-2.x-black.svg?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
  [![AI Ready](https://img.shields.io/badge/AI_Powered-Scikit--Learn-orange.svg?style=for-the-badge&logo=scikitlearn)](https://scikit-learn.org/)
</div>

<br />

## 📖 Project Overview

The **AI-Powered ERP System** is a modern, enterprise-grade business management solution designed to streamline operations across all organizational departments. Built on a completely decoupled architecture, it offers a lighting-fast React frontend and a robust Python backend. 

What sets this ERP apart is its native **AI integrations**, utilizing predictive analytics (Prophet, Scikit-Learn) to automatically forecast inventory depletion, predict sales trends, and provide actionable business insights directly on the dashboard.

---

## ✨ Key Features

- **📊 Dynamic Dashboard**: Real-time KPI tracking, revenue trailing, and stock movement charts.
- **📦 Inventory Management**: Track SKUs, manage warehouses, and monitor stock levels in real-time.
- **🤖 AI Insights & Forecasting**: Predictive modeling to detect overstock risks and suggest reorders.
- **👥 Human Resources (HR)**: Employee directory, payroll tracking, and performance metrics.
- **🤝 CRM & Sales**: Lead tracking, deal closure pipelines, and customer relationship management.
- **💼 Accounting & Purchase**: Automated PO approvals, ledger management, and financial reporting.
- **🔐 Role-Based Access Control (RBAC)**: Secure, JWT-based authentication with granular permissions for Admins, Managers, and Employees.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + ShadCN UI
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: Python 3.10+ + Flask
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens) + Werkzeug Security
- **Database**: PostgreSQL (Production) / SQLite (Local Dev Fallback)

### AI Module
- **Core Libraries**: Scikit-Learn, Pandas, Prophet (Time-series forecasting)

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    Client[Web Browser - React/Vite] -->|REST API + JWT| Gateway[Flask Backend API]
    
    Gateway --> Auth[Authentication Module]
    Gateway --> Core[Core ERP Modules]
    Gateway --> AI[AI & Forecasting Engine]
    
    Auth --> DB[(PostgreSQL / SQLite)]
    Core --> DB
    
    AI -->|Data Processing| Pandas[Pandas & NumPy]
    Pandas -->|Predictive Modeling| Scikit[Scikit-Learn / Prophet]
```

---

## 📂 Folder Structure

```text
synergybeam-erp/
├── backend/
│   ├── app.py                # Flask application entry point
│   ├── config.py             # Global configurations & DB fallback
│   ├── init_db.py            # SQLite schema initialization script
│   ├── requirements.txt      # Python dependencies
│   ├── database/             # DB schema and connection handlers
│   ├── models/               # SQLAlchemy ORM Models
│   └── routes/               # API Blueprints (auth, inventory, forecast)
│
├── frontend/
│   ├── index.html            # Vite HTML entry point
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite + Tailwind v4 config
│   ├── src/
│   │   ├── main.tsx          # React application root
│   │   ├── App.tsx           # React Router configuration
│   │   ├── components/       # ShadCN components & shared UI
│   │   ├── hooks/            # Custom hooks (e.g., use-auth)
│   │   ├── pages/            # View components for all ERP modules
│   │   └── lib/              # Axios interceptors and utilities
│
├── database/                 # Raw SQL Schemas and Seed Data
├── docker-compose.yml        # Dockerized PostgreSQL deployment
└── README.md                 # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (Optional, defaults to local SQLite if missing)

### 1. Clone the Repository
```bash
git clone https://github.com/adrajameet7805/AI-Powered-ERP-System.git
cd AI-Powered-ERP-System
```

### 2. Start the Backend
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Initialize the Database & Seed Data
python init_db.py

# Start the Flask API
python app.py
```
*The API will be available at `http://localhost:5000`*

### 3. Start the Frontend
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The UI will be available at `http://localhost:5173`*

---

## ⚙️ Environment Variables

For production, create a `.env` file in the `backend/` directory:

```env
# Database configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/synergybeam

# Security keys
SECRET_KEY=your-secure-secret-key-here
JWT_SECRET_KEY=your-secure-jwt-key-here
```

---

## 🔐 Default Login Credentials

Upon running `init_db.py` or executing `seed.sql`, the following default accounts are created:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@synergybeam.com` | `Admin@123` |
| **Manager** | `manager@synergybeam.com` | `Admin@123` |
| **Employee** | `employee@synergybeam.com` | `Admin@123` |

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login`: Authenticate and receive JWT token.
- `POST /api/auth/register`: Create a new user account.

### Inventory
- `GET /api/inventory`: Fetch all inventory items.
- `POST /api/inventory`: Add a new SKU to inventory.

### AI Forecasting
- `GET /api/forecast/inventory`: Retrieve stockout predictions and automated reorder suggestions.

---

## 🧠 AI Features Deep Dive

This system goes beyond standard CRUD operations by integrating Python-native data science libraries directly into the backend:
- **Demand Forecasting**: Analyzes historical sales data to predict future stock requirements.
- **Anomaly Detection**: Flags unusual purchasing patterns or stock discrepancies.
- **Automated Reorder Suggestions**: Calculates optimal reorder points based on lead times and predicted depletion rates.

---

## 🛡️ Security Features

- **JWT Authentication**: Stateless, secure token-based auth with configurable expiration.
- **Password Hashing**: Industry-standard Scrypt/Argon2 hashing via `werkzeug.security`.
- **Role-Based Routing**: Frontend and Backend route protection preventing privilege escalation.
- **SQL Injection Prevention**: Full reliance on SQLAlchemy ORM for parameterized queries.

---

## 📸 Screenshots

*(Replace these placeholders with actual project screenshots)*

| Dashboard Overview | Inventory Management |
| :---: | :---: |
| ![Dashboard](screenshots/dashboard.png) | ![Inventory](screenshots/inventory.png) |

| AI Forecasting | Mobile Responsive |
| :---: | :---: |
| ![AI Forecast](screenshots/ai-forecast.png) | ![Mobile View](screenshots/mobile-view.png) |

---

## 🗺️ Roadmap

- [x] Complete standalone migration (React + Flask)
- [x] Integrate SQLite fallback for easy local testing
- [x] JWT Authentication & RBAC implementation
- [ ] Connect Prophet for advanced Time-Series AI forecasting
- [ ] Dockerize full-stack application for automated deployments
- [ ] Multi-tenant architecture support
- [ ] Export to PDF / CSV for Reporting Module

---

## 👤 Author

**Adraj Ameet**
- GitHub: [@adrajameet7805](https://github.com/adrajameet7805)
- Project Repository: [AI-Powered-ERP-System](https://github.com/adrajameet7805/AI-Powered-ERP-System)

---

<div align="center">
  <p>If you find this project helpful, please consider giving it a ⭐️!</p>
</div>

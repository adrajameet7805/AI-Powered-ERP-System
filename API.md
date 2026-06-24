# API Documentation

## Base URL
`/api`

## AI Forecasting
- **`GET /api/forecast`**
  - **Description**: Returns 30-day inventory demand forecast using Prophet/Scikit-Learn models. Identifies overstock and shortage risks.

## Exports
- **`GET /api/export/pdf/<module>`**
  - **Supported Modules**: `sales`, `inventory`, `financials`
  - **Description**: Downloads a PDF report for the specified module.
- **`GET /api/export/excel/<module>`**
  - **Supported Modules**: `inventory`, `crm`, `hrms`, `accounting`
  - **Description**: Downloads an Excel (.xlsx) file containing all records.

## Core Modules (CRUD)
The following modules support standard REST operations (`GET`, `POST`, `DELETE` via `/<module>/<id>`):

### CRM
- `/api/customers`
- `/api/leads`

### Sales & Purchase
- `/api/sales_orders`
- `/api/invoices`
- `/api/suppliers`
- `/api/purchase_orders`

### HR & Projects
- `/api/employees`
- `/api/attendance`
- `/api/leave_requests`
- `/api/projects`
- `/api/tasks`

### Finance & Assets
- `/api/accounts`
- `/api/transactions`
- `/api/expenses`
- `/api/assets`

### Inventory
- `/api/inventory/products`
- `/api/warehouses`
- `/api/stock_movements`

# Synergybeam ERP API Documentation

## Authentication
`POST /api/auth/login`
- **Body:** `{ "email": "admin@example.com", "password": "password" }`
- **Response:** `{ "access_token": "jwt-token", "user": { "email": "admin@example.com", "role": "Admin" } }`

## Inventory
`GET /api/inventory`
- **Headers:** `Authorization: Bearer <jwt-token>`
- **Response:** `[{ "id": 1, "sku": "SKU-100", "quantity": 150 }]`

## AI Forecasting
`GET /api/forecast`
- **Headers:** `Authorization: Bearer <jwt-token>`
- **Response:** `{ "demand": 450, "reorder_quantity": 200, "insights": "..." }`

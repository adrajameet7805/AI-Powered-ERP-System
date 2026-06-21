import urllib.request
import json

base_url = "http://127.0.0.1:5000/api"

endpoints = [
    '/customers', '/leads',
    '/sales_orders', '/invoices',
    '/suppliers', '/purchase_orders',
    '/employees', '/attendance', '/leave_requests',
    '/projects', '/tasks',
    '/assets',
    '/accounts', '/transactions', '/expenses',
    '/inventory/products', '/warehouses', '/stock_movements'
]

results = {}

for ep in endpoints:
    try:
        req = urllib.request.Request(f"{base_url}{ep}")
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                results[ep] = "OK"
            else:
                results[ep] = f"Error: {response.status}"
    except Exception as e:
        results[ep] = f"Exception: {str(e)}"

for ep, res in results.items():
    print(f"{ep}: {res}")

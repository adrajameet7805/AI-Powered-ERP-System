import urllib.request
import json

url = "http://127.0.0.1:5000/api/purchase_orders"
data = {
    "supplier_id": "100",
    "order_date": "2023-10-01",
    "status": "draft",
    "total_amount": "150.00",
    "notes": "Test"
}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())

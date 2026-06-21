import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:5000/api"

print("--- Authentication Audit ---")

# 1. Login to get token
login_data = json.dumps({
    "email": "admin@synergybeam.com",
    "password": "Admin@123"
}).encode('utf-8')

print("\n1. Logging in as admin@synergybeam.com...")
try:
    req = urllib.request.Request(f"{BASE_URL}/auth/login", data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode())
        token = res_data.get('access_token')
        print(f"SUCCESS: Received JWT Token (Length: {len(token)})")
except Exception as e:
    print(f"FAILED TO LOGIN: {e}")
    exit(1)

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# 2. Test without token
print("\n2. Testing endpoint WITHOUT token (Should return 401)")
try:
    req = urllib.request.Request(f"{BASE_URL}/customers")
    with urllib.request.urlopen(req) as response:
        print(f"FAILED: Allowed missing token. Status: {response.getcode()}")
except urllib.error.HTTPError as e:
    if e.code == 401:
        print(f"SUCCESS: Rejected missing token ({e.read().decode()})")
    else:
        print(f"FAILED: Unexpected status {e.code}")

# 3. Test Modules
modules = [
    ("CRM", "/customers", {"name": "Audit Test Corp", "email": "audit@test.com"}),
    ("Inventory", "/inventory/products", {"sku": "TEST-123", "name": "Audit Prod"}),
    ("Sales", "/sales_orders", {"customer_id": 1, "total_amount": 500}),
    ("Purchase", "/purchase_orders", {"supplier_id": 1, "total_amount": 1000}),
    ("Accounting", "/accounts", {"account_name": "Audit Account", "account_type": "Asset"}),
    ("HR", "/employees", {"first_name": "Audit", "last_name": "Employee"}),
    ("Projects", "/projects", {"name": "Audit Project"}),
    ("Assets", "/assets", {"name": "Audit Asset", "asset_type": "Hardware"}),
    ("AI Forecasting", "/forecast/", None) # GET only
]

print("\n3. Testing Endpoints WITH Valid Token")
success_count = 0
for mod_name, endpoint, payload in modules:
    print(f"Testing {mod_name} module...")
    try:
        if payload:
            req = urllib.request.Request(f"{BASE_URL}{endpoint}", data=json.dumps(payload).encode('utf-8'), headers=headers)
        else:
            req = urllib.request.Request(f"{BASE_URL}{endpoint}", headers=headers)
            
        with urllib.request.urlopen(req) as response:
            if response.getcode() in [200, 201]:
                print(f"  [+] {mod_name} PASS: Created/Fetched successfully (Status {response.getcode()})")
                success_count += 1
            else:
                print(f"  [-] {mod_name} FAIL: {response.getcode()}")
    except urllib.error.HTTPError as e:
        print(f"  [-] {mod_name} FAIL: {e.code} - {e.read().decode()}")

print(f"\nAudit completed. Passed {success_count}/{len(modules)} modules.")

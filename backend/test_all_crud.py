import urllib.request
import urllib.error
import json
from app import create_app
from database import db
from sqlalchemy.inspection import inspect

application = create_app()

BASE_URL = "http://127.0.0.1:5000/api"

# Map frontend module endpoints to SQLAlchemy models
from models.crm import Customer, Lead
from models.product import Product
from models.inventory_models import Warehouse, StockMovement
from models.purchase import Supplier, PurchaseOrder
from models.sales import SalesOrder, Invoice
from models.hr import Employee, Attendance, LeaveRequest
from models.projects import Project, Task
from models.assets import Asset
from models.accounting import Account, Transaction, Expense

routes_map = {
    "customers": Customer,
    "leads": Lead,
    "inventory/products": Product,
    "warehouses": Warehouse,
    "stock_movements": StockMovement,
    "suppliers": Supplier,
    "purchase_orders": PurchaseOrder,
    "sales_orders": SalesOrder,
    "invoices": Invoice,
    "employees": Employee,
    "attendance": Attendance,
    "leave_requests": LeaveRequest,
    "projects": Project,
    "tasks": Task,
    "assets": Asset,
    "accounts": Account,
    "transactions": Transaction,
    "expenses": Expense
}

def generate_dummy_data(model):
    import uuid
    payload = {}
    mapper = inspect(model)
    for column in mapper.columns:
        if column.primary_key or column.name == 'created_at' or column.name == 'updated_at':
            continue
            
        type_str = str(column.type).lower()
        if 'int' in type_str:
            payload[column.name] = 1
        elif 'numeric' in type_str or 'float' in type_str:
            payload[column.name] = 100.50
        elif 'string' in type_str or 'text' in type_str or 'varchar' in type_str:
            if 'email' in column.name:
                payload[column.name] = f"test_{uuid.uuid4().hex[:6]}@example.com"
            else:
                payload[column.name] = f"Test_{uuid.uuid4().hex[:6]}"
        elif 'date' in type_str:
            payload[column.name] = "2023-10-01"
        elif 'boolean' in type_str:
            payload[column.name] = True
        else:
            payload[column.name] = "Test"
    return payload

def make_request(method, url, data=None):
    req_data = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=req_data, method=method, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode()
        except:
            pass
        return e.code, body
    except Exception as e:
        return 500, str(e)

def run_crud_tests():
    with application.app_context():
        score = {"passed": 0, "failed": 0, "failures": []}
        
        for module, model in routes_map.items():
            print(f"\nTesting {module}...")
            
            payload = generate_dummy_data(model)
            
            # CREATE
            status, response = make_request("POST", f"{BASE_URL}/{module}", payload)
            if status != 201:
                score["failed"] += 1
                score["failures"].append(f"CREATE {module} failed: {status} {response}")
                continue
                
            created_id = response.get("id") if isinstance(response, dict) else None
            
            # READ ALL
            status, response = make_request("GET", f"{BASE_URL}/{module}")
            if status != 200:
                score["failed"] += 1
                score["failures"].append(f"READ ALL {module} failed: {status} {response}")
                continue
                
            # DELETE
            if created_id:
                status, response = make_request("DELETE", f"{BASE_URL}/{module}/{created_id}")
                if status != 200:
                    score["failed"] += 1
                    score["failures"].append(f"DELETE {module} failed: {status} {response}")
                    continue
                    
            score["passed"] += 1
                
        print("\n--- RESULTS ---")
        print(f"Passed: {score['passed']}")
        print(f"Failed: {score['failed']}")
        if score["failures"]:
            for f in score["failures"]:
                print(f" - {f}")

if __name__ == "__main__":
    run_crud_tests()

from tests.conftest import auth

def test_customer_requires_name(client, admin_token):
    res = client.post("/api/customers",
                      json={"email": "no-name@test.com"},
                      headers=auth(admin_token))
    assert res.status_code == 400
    assert "error" in res.get_json()

def test_product_requires_sku_and_name(client, admin_token):
    res = client.post("/api/inventory/products",
                      json={"category": "Electronics"},
                      headers=auth(admin_token))
    assert res.status_code == 400

def test_employee_requires_code_and_name(client, admin_token):
    res = client.post("/api/employees",
                      json={"department": "IT"},
                      headers=auth(admin_token))
    assert res.status_code == 400

def test_update_nonexistent_record_returns_404(client, admin_token):
    res = client.put("/api/customers/999999",
                     json={"name": "Ghost"},
                     headers=auth(admin_token))
    assert res.status_code == 404

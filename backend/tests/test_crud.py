from tests.conftest import auth

def test_customers_full_cycle(client, admin_token):
    headers = auth(admin_token)

    # CREATE
    res = client.post("/api/customers",
                      json={"name": "Test Corp", "email": "test@corp.com",
                            "phone": "9999999999", "company": "Test Corp",
                            "status": "active"},
                      headers=headers)
    assert res.status_code == 201
    cid = res.get_json()["id"]

    # READ (paginated)
    res = client.get("/api/customers", headers=headers)
    assert res.status_code == 200
    body = res.get_json()
    assert "data" in body
    assert "total" in body
    assert isinstance(body["data"], list)

    # SEARCH
    res = client.get("/api/customers?search=Test", headers=headers)
    assert res.status_code == 200
    assert any(c["name"] == "Test Corp" for c in res.get_json()["data"])

    # UPDATE
    res = client.put(f"/api/customers/{cid}",
                     json={"name": "Updated Corp", "email": "test@corp.com",
                           "phone": "9999999999", "company": "Updated Corp",
                           "status": "active"},
                     headers=headers)
    assert res.status_code == 200
    assert res.get_json()["name"] == "Updated Corp"

    # DELETE
    res = client.delete(f"/api/customers/{cid}", headers=headers)
    assert res.status_code == 200

    # CONFIRM DELETED
    res = client.delete(f"/api/customers/{cid}", headers=headers)
    assert res.status_code == 404

def test_products_full_cycle(client, admin_token):
    headers = auth(admin_token)

    # CREATE
    res = client.post("/api/inventory/products",
                      json={"sku": "SKU-TEST-1", "name": "Test Product", "category": "Test Cat",
                            "unit_price": 99.99, "current_stock": 10},
                      headers=headers)
    assert res.status_code == 201
    pid = res.get_json()["id"]

    # READ (paginated)
    res = client.get("/api/inventory/products", headers=headers)
    assert res.status_code == 200
    body = res.get_json()
    assert "data" in body
    assert "total" in body
    assert isinstance(body["data"], list)

    # SEARCH
    res = client.get("/api/inventory/products?search=Test", headers=headers)
    assert res.status_code == 200
    assert any(c["name"] == "Test Product" for c in res.get_json()["data"])

    # UPDATE
    res = client.put(f"/api/inventory/products/{pid}",
                     json={"sku": "SKU-TEST-1", "name": "Updated Product", "category": "Test Cat",
                           "unit_price": 99.99, "current_stock": 10},
                     headers=headers)
    assert res.status_code == 200
    assert res.get_json()["name"] == "Updated Product"

    # DELETE
    res = client.delete(f"/api/inventory/products/{pid}", headers=headers)
    assert res.status_code == 200

    # CONFIRM DELETED
    res = client.delete(f"/api/inventory/products/{pid}", headers=headers)
    assert res.status_code == 404

def test_projects_full_cycle(client, admin_token):
    headers = auth(admin_token)

    # CREATE
    res = client.post("/api/projects",
                      json={"name": "Test Project"},
                      headers=headers)
    assert res.status_code == 201
    pid = res.get_json()["id"]

    # READ (paginated)
    res = client.get("/api/projects", headers=headers)
    assert res.status_code == 200
    body = res.get_json()
    assert "data" in body
    assert "total" in body
    assert isinstance(body["data"], list)

    # SEARCH
    res = client.get("/api/projects?search=Test", headers=headers)
    assert res.status_code == 200
    assert any(c["name"] == "Test Project" for c in res.get_json()["data"])

    # UPDATE
    res = client.put(f"/api/projects/{pid}",
                     json={"name": "Updated Project"},
                     headers=headers)
    assert res.status_code == 200
    assert res.get_json()["name"] == "Updated Project"

    # DELETE
    res = client.delete(f"/api/projects/{pid}", headers=headers)
    assert res.status_code == 200

    # CONFIRM DELETED
    res = client.delete(f"/api/projects/{pid}", headers=headers)
    assert res.status_code == 404

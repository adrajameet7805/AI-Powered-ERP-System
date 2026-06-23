def test_login_success(client):
    res = client.post("/api/auth/login",
                      json={"email": "admin@test.com", "password": "Admin@123"})
    assert res.status_code == 200
    data = res.get_json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["role"] == "Admin"

def test_login_wrong_password(client):
    res = client.post("/api/auth/login",
                      json={"email": "admin@test.com", "password": "wrong"})
    assert res.status_code == 401

def test_login_unknown_email(client):
    res = client.post("/api/auth/login",
                      json={"email": "nobody@test.com", "password": "Admin@123"})
    assert res.status_code == 401

def test_protected_without_token(client):
    res = client.get("/api/customers")
    assert res.status_code == 401

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"

def test_employee_cannot_access_accounting(client, employee_token):
    from tests.conftest import auth
    res = client.get("/api/accounts", headers=auth(employee_token))
    assert res.status_code == 403

def test_admin_can_access_accounting(client, admin_token):
    from tests.conftest import auth
    res = client.get("/api/accounts", headers=auth(admin_token))
    assert res.status_code == 200

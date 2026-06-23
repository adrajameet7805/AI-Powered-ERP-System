from tests.conftest import auth

def test_forecast_returns_valid_structure(client, admin_token):
    res = client.get("/api/forecast/", headers=auth(admin_token))
    assert res.status_code == 200
    data = res.get_json()
    assert "sku_insights" in data or "insights" in data or isinstance(data, list)

def test_employee_cannot_access_forecast(client, employee_token):
    from tests.conftest import auth as mkauth
    res = client.get("/api/forecast/", headers=mkauth(employee_token))
    assert res.status_code == 403

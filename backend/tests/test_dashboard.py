from tests.conftest import auth

def test_kpis_returns_all_fields(client, admin_token):
    res = client.get("/api/dashboard/kpis", headers=auth(admin_token))
    assert res.status_code == 200
    data = res.get_json()
    for field in ["total_revenue","total_customers",
                  "total_products","total_employees"]:
        assert field in data
        assert isinstance(data[field], (int, float))

def test_revenue_chart_returns_6_months(client, admin_token):
    res = client.get("/api/dashboard/revenue-chart",
                     headers=auth(admin_token))
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) == 6
    assert all("month" in d and "revenue" in d for d in data)

def test_activity_feed_returns_list(client, admin_token):
    res = client.get("/api/dashboard/activity-feed",
                     headers=auth(admin_token))
    assert res.status_code == 200
    assert isinstance(res.get_json(), list)

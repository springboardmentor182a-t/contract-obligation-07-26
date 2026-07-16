def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@contractiq.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
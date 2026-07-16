def test_get_user(client):
    response = client.get("/api/v1/users/1")
    assert response.status_code == 200
    assert response.json()["email"] == "admin@contractiq.com"
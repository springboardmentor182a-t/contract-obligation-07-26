def test_get_todos_endpoint(client):
    response = client.get("/api/v1/todos/")
    assert response.status_code == 200
    assert type(response.json()) == list
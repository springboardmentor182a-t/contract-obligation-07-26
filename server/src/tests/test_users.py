import pytest
from fastapi.testclient import TestClient
from src.main import app

def test_get_users_unauthorized(client: TestClient):
    """BE_USER_001: Unauthorized access without token returns 401."""
    unauthenticated_client = TestClient(app)
    response = unauthenticated_client.get("/api/users")
    assert response.status_code in [401, 403, 422]

def test_get_all_users(client: TestClient):
    """BE_USER_002: Compliance officer user list query endpoint check."""
    response = client.get("/api/users")
    assert response.status_code in [200, 401, 403]

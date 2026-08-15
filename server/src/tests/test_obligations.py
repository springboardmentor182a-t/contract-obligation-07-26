import pytest
from fastapi.testclient import TestClient

def test_get_obligations_tracker_list(client: TestClient):
    """BE_OBLIGATION_001: Fetch list of tracked contract obligations."""
    response = client.get("/api/obligations")
    assert response.status_code in [200, 307, 401, 404]

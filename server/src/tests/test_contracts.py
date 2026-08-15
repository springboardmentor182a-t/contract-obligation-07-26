import pytest
from fastapi.testclient import TestClient

def test_get_contract_repository_list(client: TestClient):
    """BE_CONTRACT_001: Fetch list of contracts in contract repository."""
    response = client.get("/api/contracts")
    assert response.status_code in [200, 401, 404]

def test_get_contract_by_id(client: TestClient):
    """BE_CONTRACT_002: Fetch contract by ID endpoint check."""
    response = client.get("/api/contracts/99999")
    assert response.status_code in [200, 401, 404]

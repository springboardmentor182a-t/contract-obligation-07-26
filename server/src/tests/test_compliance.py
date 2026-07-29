from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_create_and_get_control():
    payload = {
        "id": "TEST-CTRL-001",
        "title": "Test Control Rule",
        "status": "PASSED",
        "weight": 100,
    }
    response = client.post("/api/compliance/controls", json=payload)
    assert response.status_code in [201, 400]

    log_payload = {
        "status": "VERIFIED",
        "message": "Automated verification test completed.",
    }
    log_response = client.post("/api/compliance/controls/TEST-CTRL-001/logs", json=log_payload)
    assert log_response.status_code == 201
    log_data = log_response.json()
    assert log_data["message"] == "Automated verification test completed."

    get_res = client.get("/api/compliance/controls/TEST-CTRL-001")
    assert get_res.status_code == 200
    assert len(get_res.json()["logs"]) >= 1


def test_get_compliance_controls():
    response = client.get("/api/compliance/controls")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_compliance_summary():
    response = client.get("/api/compliance/summary")
    assert response.status_code == 200
    data = response.json()
    assert "overallScore" in data
    assert "passedChecks" in data
    assert "warningsOutstanding" in data
    assert "failedPolicies" in data
    assert "totalControls" in data

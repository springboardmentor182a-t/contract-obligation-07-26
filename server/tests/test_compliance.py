from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_get_compliance_controls():
    response = client.get("/api/compliance/controls")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first_control = data[0]
    assert "id" in first_control
    assert "title" in first_control
    assert "status" in first_control
    assert "weight" in first_control
    assert "lastVerified" in first_control
    assert "logs" in first_control


def test_get_compliance_summary():
    response = client.get("/api/compliance/summary")
    assert response.status_code == 200
    data = response.json()
    assert "overallScore" in data
    assert "passedChecks" in data
    assert "warningsOutstanding" in data
    assert "failedPolicies" in data
    assert "totalControls" in data


def test_create_and_get_control():
    payload = {
        "id": "TEST-CTRL-001",
        "title": "Test Control Rule",
        "status": "PASSED",
        "weight": 100,
    }
    response = client.post("/api/compliance/controls", json=payload)
    assert response.status_code == 201
    ctrl_data = response.json()
    assert ctrl_data["id"] == "TEST-CTRL-001"

    # Add log entry
    log_payload = {
        "status": "VERIFIED",
        "message": "Automated verification test completed.",
    }
    log_response = client.post("/api/compliance/controls/TEST-CTRL-001/logs", json=log_payload)
    assert log_response.status_code == 201
    log_data = log_response.json()
    assert log_data["message"] == "Automated verification test completed."

    # Verify single fetch
    get_res = client.get("/api/compliance/controls/TEST-CTRL-001")
    assert get_res.status_code == 200
    assert len(get_res.json()["logs"]) == 1

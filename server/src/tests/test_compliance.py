import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.auth.jwt import create_access_token
from src.database.core import get_db
from src.database.models import (
    AuditLogModel,
    ComplianceControl,
    ComplianceLog,
    User,
)
from src.main import app


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        execution_options={
            "schema_translate_map": {"public": None},
        },
    )
    session_factory = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
        expire_on_commit=False,
    )

    User.__table__.create(engine)
    AuditLogModel.__table__.create(engine)
    ComplianceControl.__table__.create(engine)
    ComplianceLog.__table__.create(engine)

    db = session_factory()
    authorized_user = User(
        id=1,
        name="Test Compliance Officer",
        full_name="Test Compliance Officer",
        email="compliance.test@example.com",
        password="not-used-by-token-authentication",
        role="Compliance Officer",
        is_active=True,
    )
    db.add(authorized_user)
    db.commit()
    db.close()

    def override_get_db():
        test_db = session_factory()
        try:
            yield test_db
        finally:
            test_db.close()

    app.dependency_overrides[get_db] = override_get_db
    access_token = create_access_token(
        {
            "sub": str(authorized_user.id),
            "email": authorized_user.email,
            "role": authorized_user.role,
        }
    )
    test_client = TestClient(app)
    test_client.headers.update(
        {"Authorization": f"Bearer {access_token}"}
    )

    try:
        yield test_client
    finally:
        test_client.close()
        app.dependency_overrides.pop(get_db, None)
        engine.dispose()


def test_create_and_get_control(client: TestClient):
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


def test_get_compliance_controls(client: TestClient):
    response = client.get("/api/compliance/controls")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_compliance_summary(client: TestClient):
    response = client.get("/api/compliance/summary")
    assert response.status_code == 200
    data = response.json()
    assert "overallScore" in data
    assert "passedChecks" in data
    assert "warningsOutstanding" in data
    assert "failedPolicies" in data
    assert "totalControls" in data

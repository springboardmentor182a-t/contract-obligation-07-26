from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from src.compliance import controller
from src.compliance.schemas import ComplianceControlCreate, ComplianceLogCreate
from src.database.models import ComplianceLog


class FakeResult:
    def __init__(self, value):
        self.value = value

    def scalars(self):
        return self

    def first(self):
        return self.value


class FakeDatabaseSession:
    def __init__(self, query_result=None, commit_error=None):
        self.query_result = query_result
        self.commit_error = commit_error
        self.added = []
        self.commit_count = 0

    def execute(self, statement):
        return FakeResult(self.query_result)

    def add(self, value):
        self.added.append(value)

    def commit(self):
        if self.commit_error:
            raise self.commit_error
        self.commit_count += 1

    def refresh(self, value):
        if isinstance(value, ComplianceLog) and value.id is None:
            value.id = 15


def capture_audit_calls(monkeypatch):
    calls = []
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def test_create_compliance_control_creates_audit_log(monkeypatch):
    db = FakeDatabaseSession()
    audit_calls = capture_audit_calls(monkeypatch)
    payload = ComplianceControlCreate(
        id="SOX-404-TEST",
        title="Quarterly access review",
        status="PASSED",
        weight=100,
    )

    response = controller.create_compliance_control(payload, db)

    assert response.id == "SOX-404-TEST"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "Compliance Control Created",
        "module": "Compliance",
        "description": (
            "Created compliance control: Quarterly access review "
            "(ID: SOX-404-TEST, status: PASSED)"
        ),
    }


def test_duplicate_compliance_control_is_not_logged(monkeypatch):
    existing = SimpleNamespace(id="SOX-404-TEST")
    db = FakeDatabaseSession(existing)
    audit_calls = capture_audit_calls(monkeypatch)
    payload = ComplianceControlCreate(
        id="SOX-404-TEST",
        title="Quarterly access review",
    )

    with pytest.raises(HTTPException) as error:
        controller.create_compliance_control(payload, db)

    assert error.value.status_code == 400
    assert db.commit_count == 0
    assert audit_calls == []


def test_add_compliance_log_creates_audit_log(monkeypatch):
    control = SimpleNamespace(
        id="SOX-404-TEST",
        title="Quarterly access review",
        last_verified=None,
    )
    db = FakeDatabaseSession(control)
    audit_calls = capture_audit_calls(monkeypatch)
    payload = ComplianceLogCreate(
        status="VERIFIED",
        message="Access review completed successfully.",
    )

    response = controller.add_compliance_log(
        control_id=control.id,
        payload=payload,
        db=db,
    )

    assert response.id == 15
    assert response.status == "VERIFIED"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "UPDATE",
        "action": "Compliance Verification Recorded",
        "module": "Compliance",
        "description": (
            "Recorded compliance verification for: Quarterly access review "
            "(ID: SOX-404-TEST, status: VERIFIED)"
        ),
    }


def test_missing_compliance_control_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)
    payload = ComplianceLogCreate(
        status="VERIFIED",
        message="Access review completed successfully.",
    )

    with pytest.raises(HTTPException) as error:
        controller.add_compliance_log(
            control_id="MISSING",
            payload=payload,
            db=db,
        )

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_failed_compliance_commit_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(
        commit_error=RuntimeError("database commit failed")
    )
    audit_calls = capture_audit_calls(monkeypatch)
    payload = ComplianceControlCreate(
        id="SOX-404-FAILED",
        title="Failed control creation",
    )

    with pytest.raises(RuntimeError, match="database commit failed"):
        controller.create_compliance_control(payload, db)

    assert audit_calls == []

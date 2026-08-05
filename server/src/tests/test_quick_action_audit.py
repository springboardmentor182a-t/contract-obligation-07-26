from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from src.database.models import QuickActionLog
from src.quick_actions import controller


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
        if isinstance(value, QuickActionLog) and value.id is None:
            value.id = 73


def capture_audit_calls(monkeypatch):
    calls = []
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def make_action():
    return SimpleNamespace(
        id="compliance-audit",
        label="Run Compliance Audit",
    )


def test_execute_quick_action_creates_audit_log(monkeypatch):
    action = make_action()
    db = FakeDatabaseSession(action)
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.execute_action(
        controller.ExecutePayload(action_id=action.id),
        db,
    )

    assert response.id == 73
    assert response.label == "Run Compliance Audit"
    assert response.status == "Success"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "Quick Action Executed",
        "module": "Quick Actions",
        "description": (
            "Executed quick action: Run Compliance Audit "
            "(action ID: compliance-audit, execution log ID: 73, "
            "status: Success)"
        ),
    }


def test_missing_quick_action_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(HTTPException) as error:
        controller.execute_action(
            controller.ExecutePayload(action_id="missing"),
            db,
        )

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_failed_quick_action_commit_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(
        query_result=make_action(),
        commit_error=RuntimeError("database commit failed"),
    )
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(RuntimeError, match="database commit failed"):
        controller.execute_action(
            controller.ExecutePayload(action_id="compliance-audit"),
            db,
        )

    assert audit_calls == []

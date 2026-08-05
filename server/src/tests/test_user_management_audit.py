from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from src.database.models import User, UserInvitation
from src.users import controller
from src.users.schemas import UserInviteRequest, UserUpdateRequest


class FakeResult:
    def __init__(self, value):
        self.value = value

    def scalar_one_or_none(self):
        return self.value


class FakeDatabaseSession:
    def __init__(self, query_result=None, commit_error=None):
        self.query_result = query_result
        self.commit_error = commit_error
        self.added = []
        self.deleted = []
        self.commit_count = 0

    def execute(self, statement):
        return FakeResult(self.query_result)

    def add(self, value):
        self.added.append(value)

    def delete(self, value):
        self.deleted.append(value)

    def commit(self):
        if self.commit_error:
            raise self.commit_error
        self.commit_count += 1

    def refresh(self, value):
        if isinstance(value, UserInvitation):
            value.id = 31
            value.created_at = datetime(2026, 8, 5, tzinfo=timezone.utc)
        elif isinstance(value, User):
            value.id = value.id or 51


def capture_audit_calls(monkeypatch):
    calls = []
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def invite_payload():
    return UserInviteRequest(
        full_name="Asha Rao",
        email="asha@example.com",
        role="Compliance Officer",
        department="Compliance",
        message="Welcome to ContractIQ",
    )


def make_user():
    return SimpleNamespace(
        id=51,
        name="Asha Rao",
        full_name="Asha Rao",
        email="asha@example.com",
        role="Employee",
        department="Operations",
        status="Active",
    )


def test_invite_user_creates_audit_log(monkeypatch):
    db = FakeDatabaseSession()
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.invite_user(invite_payload(), db)

    assert response.id == 31
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "User Invited",
        "module": "User Management",
        "description": (
            "Invited user: Asha Rao (ID: 51, email: asha@example.com, "
            "role: Compliance Officer)"
        ),
    }


def test_duplicate_user_invitation_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(make_user())
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(HTTPException) as error:
        controller.invite_user(invite_payload(), db)

    assert error.value.status_code == 400
    assert db.commit_count == 0
    assert audit_calls == []


def test_update_user_creates_audit_log(monkeypatch):
    user = make_user()
    db = FakeDatabaseSession(user)
    audit_calls = capture_audit_calls(monkeypatch)
    payload = UserUpdateRequest(
        full_name="Asha Rao",
        email="asha@example.com",
        role="Compliance Officer",
        department="Compliance",
        status="Inactive",
    )

    response = controller.update_user(user.id, payload, db)

    assert response.role == "Compliance Officer"
    assert response.status == "Inactive"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0]["event_type"] == "UPDATE"
    assert audit_calls[0]["action"] == "User Updated"
    assert audit_calls[0]["module"] == "User Management"
    assert audit_calls[0]["description"] == (
        "Updated user: Asha Rao (ID: 51, role: Employee -> "
        "Compliance Officer, status: Active -> Inactive)"
    )


def test_missing_user_update_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)
    payload = UserUpdateRequest(
        full_name="Missing User",
        email="missing@example.com",
        role="Employee",
        department="Operations",
        status="Active",
    )

    with pytest.raises(HTTPException) as error:
        controller.update_user(999, payload, db)

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_delete_user_creates_audit_log(monkeypatch):
    user = make_user()
    db = FakeDatabaseSession(user)
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.delete_user(user.id, db)

    assert response == {"message": "User deleted successfully"}
    assert db.deleted == [user]
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "DELETE",
        "action": "User Deleted",
        "module": "User Management",
        "description": (
            "Deleted user: Asha Rao (ID: 51, email: asha@example.com)"
        ),
    }


def test_missing_user_delete_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(HTTPException) as error:
        controller.delete_user(999, db)

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_failed_user_commit_is_not_logged(monkeypatch):
    user = make_user()
    db = FakeDatabaseSession(
        query_result=user,
        commit_error=RuntimeError("database commit failed"),
    )
    audit_calls = capture_audit_calls(monkeypatch)
    payload = UserUpdateRequest(
        full_name="Asha Rao",
        email="asha@example.com",
        role="Compliance Officer",
        department="Compliance",
        status="Active",
    )

    with pytest.raises(RuntimeError, match="database commit failed"):
        controller.update_user(user.id, payload, db)

    assert audit_calls == []

from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from src.profile import controller


class FakeDatabaseSession:
    def __init__(self, commit_error=None):
        self.commit_error = commit_error
        self.added = []
        self.commit_count = 0
        self.rollback_count = 0

    def add(self, value):
        self.added.append(value)

    def commit(self):
        if self.commit_error:
            raise self.commit_error
        self.commit_count += 1

    def refresh(self, value):
        return None

    def rollback(self):
        self.rollback_count += 1


def make_user():
    return SimpleNamespace(
        id=8,
        name="Alex Kim",
        full_name="Alex Kim",
        email="alex@example.com",
        role="Contract Manager",
        department="Legal",
        job_title="Contract Specialist",
        phone="1234567890",
        bio="Contract operations",
        avatar_url=None,
        updated_at=datetime(2026, 8, 5, tzinfo=timezone.utc),
    )


def capture_audit_calls(monkeypatch):
    calls = []
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def test_update_profile_creates_user_attributed_audit_log(monkeypatch):
    user = make_user()
    db = FakeDatabaseSession()
    audit_calls = capture_audit_calls(monkeypatch)
    payload = controller.ProfileUpdate(
        full_name="Alexandra Kim",
        phone="9876543210",
    )

    response = controller.update_profile(payload, user, db)

    assert response.full_name == "Alexandra Kim"
    assert response.phone == "9876543210"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": 8,
        "event_type": "UPDATE",
        "action": "Profile Updated",
        "module": "Profile",
        "description": (
            "Updated profile: alex@example.com "
            "(ID: 8, fields: full_name, phone)"
        ),
    }


def test_failed_profile_update_is_not_logged(monkeypatch):
    user = make_user()
    db = FakeDatabaseSession(
        commit_error=RuntimeError("database commit failed")
    )
    audit_calls = capture_audit_calls(monkeypatch)
    payload = controller.ProfileUpdate(phone="9876543210")

    with pytest.raises(HTTPException) as error:
        controller.update_profile(payload, user, db)

    assert error.value.status_code == 500
    assert db.rollback_count == 1
    assert audit_calls == []

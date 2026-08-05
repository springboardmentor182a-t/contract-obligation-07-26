from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from src.notifications import controller


class FakeResult:
    def __init__(self, value=None, rowcount=None):
        self.value = value
        self.rowcount = rowcount

    def scalars(self):
        return self

    def first(self):
        return self.value


class FakeDatabaseSession:
    def __init__(self, query_result=None, rowcount=None, commit_error=None):
        self.query_result = query_result
        self.rowcount = rowcount
        self.commit_error = commit_error
        self.added = []
        self.deleted = []
        self.commit_count = 0

    def execute(self, statement):
        return FakeResult(self.query_result, self.rowcount)

    def add(self, value):
        self.added.append(value)

    def delete(self, value):
        self.deleted.append(value)

    def commit(self):
        if self.commit_error:
            raise self.commit_error
        self.commit_count += 1


def make_notification():
    return SimpleNamespace(
        id=14,
        user_id=12,
        title="Contract expires soon",
        is_read=False,
    )


def capture_audit_calls(monkeypatch, user_id=12):
    calls = []
    monkeypatch.setattr(controller, "_get_user_id", lambda token: user_id)
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def test_mark_notification_read_creates_audit_log(monkeypatch):
    notification = make_notification()
    db = FakeDatabaseSession(notification)
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.mark_as_read(14, "token", db)

    assert response == {"status": "success"}
    assert notification.is_read is True
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": 12,
        "event_type": "UPDATE",
        "action": "Notification Marked Read",
        "module": "Notifications",
        "description": (
            "Marked notification as read: Contract expires soon (ID: 14)"
        ),
    }


def test_missing_notification_read_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(HTTPException) as error:
        controller.mark_as_read(999, "token", db)

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_mark_all_notifications_read_creates_audit_log(monkeypatch):
    db = FakeDatabaseSession(rowcount=3)
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.mark_all_read("token", db)

    assert response == {"status": "success"}
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": 12,
        "event_type": "UPDATE",
        "action": "All Notifications Marked Read",
        "module": "Notifications",
        "description": (
            "Marked all notifications as read for user ID: 12, affected: 3"
        ),
    }


def test_dismiss_notification_creates_audit_log(monkeypatch):
    notification = make_notification()
    db = FakeDatabaseSession(notification)
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.dismiss_notification(14, "token", db)

    assert response == {"status": "success"}
    assert db.deleted == [notification]
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": 12,
        "event_type": "DELETE",
        "action": "Notification Dismissed",
        "module": "Notifications",
        "description": (
            "Dismissed notification: Contract expires soon (ID: 14)"
        ),
    }


def test_missing_notification_dismissal_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(HTTPException) as error:
        controller.dismiss_notification(999, "token", db)

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_failed_notification_commit_is_not_logged(monkeypatch):
    notification = make_notification()
    db = FakeDatabaseSession(
        query_result=notification,
        commit_error=RuntimeError("database commit failed"),
    )
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(RuntimeError, match="database commit failed"):
        controller.mark_as_read(14, "token", db)

    assert audit_calls == []

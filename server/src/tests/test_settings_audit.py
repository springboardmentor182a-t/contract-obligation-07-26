from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from src.database.models import ApiKey
from src.settings_module import controller


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
        if isinstance(value, ApiKey) and value.id is None:
            value.id = 91


def capture_audit_calls(monkeypatch):
    calls = []
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def make_settings():
    return SimpleNamespace(
        user_id=1,
        org_name="Acme Corp",
        currency="USD",
        date_format="YYYY-MM-DD",
        email_notif=True,
        slack_notif=False,
        renewal_alerts=True,
        two_factor=True,
        sso=False,
    )


def test_update_settings_creates_audit_log(monkeypatch):
    settings = make_settings()
    db = FakeDatabaseSession(settings)
    audit_calls = capture_audit_calls(monkeypatch)
    payload = controller.SettingsUpdate(
        currency="INR",
        email_notif=False,
    )

    response = controller.update_settings(payload, db)

    assert response.currency == "INR"
    assert response.email_notif is False
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "UPDATE",
        "action": "Settings Updated",
        "module": "Settings",
        "description": (
            "Updated settings for user ID: 1 "
            "(fields: currency, email_notif)"
        ),
    }


def test_missing_settings_update_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(HTTPException) as error:
        controller.update_settings(
            controller.SettingsUpdate(currency="INR"),
            db,
        )

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_update_gateways_creates_audit_log(monkeypatch):
    settings = make_settings()
    db = FakeDatabaseSession(settings)
    audit_calls = capture_audit_calls(monkeypatch)
    payload = controller.GatewayUpdate(
        emailNotif=False,
        smsNotif=True,
        renewalAlerts=False,
    )

    response = controller.update_gateways(payload, db)

    assert response["status"] == "success"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0]["event_type"] == "UPDATE"
    assert audit_calls[0]["action"] == "Notification Gateways Updated"
    assert audit_calls[0]["module"] == "Settings"
    assert audit_calls[0]["description"] == (
        "Updated notification gateways for user ID: 1 "
        "(email: False, renewal alerts: False)"
    )


def test_create_api_key_creates_audit_log(monkeypatch):
    db = FakeDatabaseSession()
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.create_api_key(
        controller.ApiKeyCreate(name="Reporting Integration"),
        db,
    )

    assert response.id == 91
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "API Key Created",
        "module": "Settings",
        "description": (
            "Created API key: Reporting Integration (ID: 91, user ID: 1)"
        ),
    }
    assert response.key not in audit_calls[0]["description"]


def test_failed_settings_commit_is_not_logged(monkeypatch):
    settings = make_settings()
    db = FakeDatabaseSession(
        query_result=settings,
        commit_error=RuntimeError("database commit failed"),
    )
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(RuntimeError, match="database commit failed"):
        controller.update_settings(
            controller.SettingsUpdate(currency="INR"),
            db,
        )

    assert audit_calls == []

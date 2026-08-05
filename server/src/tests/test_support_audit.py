import pytest

from src.database.models import SupportTicket
from src.support import controller


class FakeDatabaseSession:
    def __init__(self, commit_error=None):
        self.commit_error = commit_error
        self.added = []
        self.commit_count = 0

    def add(self, value):
        self.added.append(value)

    def commit(self):
        if self.commit_error:
            raise self.commit_error
        self.commit_count += 1

    def refresh(self, value):
        if isinstance(value, SupportTicket) and value.id is None:
            value.id = 82


def capture_audit_calls(monkeypatch):
    calls = []
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def make_payload():
    return controller.TicketCreate(
        subject="Unable to export renewal report",
        severity="High",
        description="The renewal report export is unavailable.",
    )


def test_create_support_ticket_creates_audit_log(monkeypatch):
    db = FakeDatabaseSession()
    audit_calls = capture_audit_calls(monkeypatch)

    response = controller.create_ticket(make_payload(), db)

    assert response == {"id": 82, "status": "created"}
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "Support Ticket Created",
        "module": "Support",
        "description": (
            "Created support ticket: Unable to export renewal report "
            "(ID: 82, severity: High, status: Open)"
        ),
    }


def test_failed_support_ticket_commit_is_not_logged(monkeypatch):
    db = FakeDatabaseSession(
        commit_error=RuntimeError("database commit failed"),
    )
    audit_calls = capture_audit_calls(monkeypatch)

    with pytest.raises(RuntimeError, match="database commit failed"):
        controller.create_ticket(make_payload(), db)

    assert audit_calls == []

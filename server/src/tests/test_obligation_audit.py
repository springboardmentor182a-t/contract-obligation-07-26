from datetime import date
from types import SimpleNamespace

from src.database.models import ObligationModel
from src.obligations.schemas import ObligationCreate, ObligationUpdate
from src.obligations import service


class FakeQuery:
    def __init__(self, value):
        self.value = value

    def filter(self, condition):
        return self

    def first(self):
        return self.value


class FakeDatabaseSession:
    def __init__(self, query_result=None):
        self.query_result = query_result
        self.added = []
        self.deleted = []
        self.commit_count = 0

    def query(self, model):
        return FakeQuery(self.query_result)

    def add(self, value):
        self.added.append(value)

    def delete(self, value):
        self.deleted.append(value)

    def commit(self):
        self.commit_count += 1

    def refresh(self, value):
        if isinstance(value, ObligationModel) and value.id is None:
            value.id = 101


def capture_audit_calls(monkeypatch):
    calls = []
    monkeypatch.setattr(
        service,
        "create_audit_log",
        lambda **kwargs: calls.append(kwargs),
    )
    return calls


def make_obligation(**overrides):
    values = {
        "id": 7,
        "title": "Submit quarterly report",
        "description": "Prepare and submit the report",
        "contract_id": 42,
        "owner_id": 3,
        "priority": "High",
        "status": "due",
        "due_date": date(2026, 9, 30),
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def test_create_obligation_creates_audit_log(monkeypatch):
    db = FakeDatabaseSession()
    audit_calls = capture_audit_calls(monkeypatch)
    payload = ObligationCreate(
        title="Submit quarterly report",
        description="Prepare and submit the report",
        contract_id=42,
        owner_id=3,
        priority="High",
        status="due",
        due_date=date(2026, 9, 30),
    )

    obligation = service.ObligationService.create_obligation(
        db=db,
        obligation_data=payload,
    )

    assert obligation.id == 101
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "Obligation Created",
        "module": "Obligation Tracker",
        "description": (
            "Created obligation: Submit quarterly report "
            "(ID: 101, contract ID: 42)"
        ),
    }


def test_update_obligation_creates_update_audit_log(monkeypatch):
    obligation = make_obligation()
    db = FakeDatabaseSession(obligation)
    audit_calls = capture_audit_calls(monkeypatch)

    updated = service.ObligationService.update_obligation(
        db=db,
        obligation_id=obligation.id,
        obligation_data=ObligationUpdate(title="Submit annual report"),
    )

    assert updated.title == "Submit annual report"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0]["event_type"] == "UPDATE"
    assert audit_calls[0]["action"] == "Obligation Updated"
    assert audit_calls[0]["module"] == "Obligation Tracker"
    assert audit_calls[0]["description"] == (
        "Updated obligation: Submit annual report (ID: 7)"
    )


def test_status_change_creates_specific_audit_log(monkeypatch):
    obligation = make_obligation(status="due")
    db = FakeDatabaseSession(obligation)
    audit_calls = capture_audit_calls(monkeypatch)

    updated = service.ObligationService.update_obligation(
        db=db,
        obligation_id=obligation.id,
        obligation_data=ObligationUpdate(status="completed"),
    )

    assert updated.status == "completed"
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0]["event_type"] == "UPDATE"
    assert audit_calls[0]["action"] == "Obligation Status Changed"
    assert audit_calls[0]["module"] == "Obligation Tracker"
    assert audit_calls[0]["description"] == (
        "Changed obligation status: Submit quarterly report "
        "(ID: 7) from due to completed"
    )


def test_delete_obligation_creates_audit_log(monkeypatch):
    obligation = make_obligation()
    db = FakeDatabaseSession(obligation)
    audit_calls = capture_audit_calls(monkeypatch)

    deleted = service.ObligationService.delete_obligation(
        db=db,
        obligation_id=obligation.id,
    )

    assert deleted is True
    assert db.deleted == [obligation]
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "DELETE",
        "action": "Obligation Deleted",
        "module": "Obligation Tracker",
        "description": (
            "Deleted obligation: Submit quarterly report (ID: 7)"
        ),
    }


def test_missing_obligation_is_not_logged_on_update(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)

    updated = service.ObligationService.update_obligation(
        db=db,
        obligation_id=999,
        obligation_data=ObligationUpdate(status="completed"),
    )

    assert updated is None
    assert db.commit_count == 0
    assert audit_calls == []


def test_missing_obligation_is_not_logged_on_delete(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = capture_audit_calls(monkeypatch)

    deleted = service.ObligationService.delete_obligation(
        db=db,
        obligation_id=999,
    )

    assert deleted is False
    assert db.commit_count == 0
    assert audit_calls == []

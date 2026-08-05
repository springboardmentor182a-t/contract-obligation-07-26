from datetime import date

import pytest

from src.renewals import service
from src.renewals.schemas import RenewalCreate


class FakeRenewalRepository:
    def __init__(self, error=None):
        self.error = error
        self.created = []

    def create(self, db, renewal):
        if self.error:
            raise self.error

        renewal.id = 25
        self.created.append(renewal)
        return renewal


def make_payload():
    return RenewalCreate(
        contract_name="Cloud Services Agreement",
        vendor="Example Cloud",
        department="Technology",
        renewal_date=date(2026, 10, 1),
        expiry_date=date(2026, 12, 31),
        status="Upcoming",
        approval_status="Pending",
        contract_value=125000,
        confidence=82,
        recommendation="Renew",
    )


def test_create_renewal_creates_audit_log(monkeypatch):
    db = object()
    audit_calls = []
    renewal_service = service.RenewalService()
    renewal_service.repo = FakeRenewalRepository()

    monkeypatch.setattr(
        service,
        "create_audit_log",
        lambda **kwargs: audit_calls.append(kwargs),
    )

    renewal = renewal_service.create(db, make_payload())

    assert renewal.id == 25
    assert renewal_service.repo.created == [renewal]
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "Renewal Created",
        "module": "Renewal Dashboard",
        "description": (
            "Created renewal: Cloud Services Agreement "
            "(ID: 25, status: Upcoming, approval: Pending)"
        ),
    }


def test_failed_renewal_creation_is_not_logged(monkeypatch):
    db = object()
    audit_calls = []
    renewal_service = service.RenewalService()
    renewal_service.repo = FakeRenewalRepository(
        error=RuntimeError("database commit failed")
    )

    monkeypatch.setattr(
        service,
        "create_audit_log",
        lambda **kwargs: audit_calls.append(kwargs),
    )

    with pytest.raises(RuntimeError, match="database commit failed"):
        renewal_service.create(db, make_payload())

    assert audit_calls == []

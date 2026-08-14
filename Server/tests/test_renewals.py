import pytest
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.database.core import Base
from src.entities.renewal import Renewal, RenewalStatus, RenewalApproval, RenewalReminder, RenewalHistory, ApprovalStatus
from src.entities.contract import Contract
from src.entities.obligation import Obligation
from src.renewals import service
from src.renewals.models import RenewalCreate

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


def test_resolve_status_enum():
    assert service._resolve_status_enum("Upcoming") == RenewalStatus.UPCOMING
    assert service._resolve_status_enum("In Progress") == RenewalStatus.IN_PROGRESS
    assert service._resolve_status_enum("Renewed") == RenewalStatus.RENEWED
    assert service._resolve_status_enum("Expired") == RenewalStatus.EXPIRED
    assert service._resolve_status_enum("Closed") == RenewalStatus.CLOSED
    assert service._resolve_status_enum("Close Renewal") == RenewalStatus.CLOSED
    assert service._resolve_status_enum("Cancelled") == RenewalStatus.CLOSED


def test_create_renewal_with_approval_steps(db_session):
    data = RenewalCreate(
        contract_name="Test Cloud SaaS",
        contract_id_ref="CNT-TEST-001",
        category="Software License",
        vendor="Cloud Corp",
        owner="Alice",
        expiry_date=datetime.utcnow() + timedelta(days=60),
        value=15000.0,
        status="Upcoming",
        auto_renew=False
    )
    renewal = service.create_renewal(db_session, data)
    assert renewal.renewal_id is not None
    assert renewal.status == RenewalStatus.UPCOMING
    assert len(renewal.approvals) == 2
    assert len(renewal.history) >= 1


def test_update_renewal_status_to_closed(db_session):
    data = RenewalCreate(
        contract_name="Test Service",
        contract_id_ref="CNT-TEST-002",
        category="IT Services",
        vendor="IT Pro",
        owner="Bob",
        expiry_date=datetime.utcnow() + timedelta(days=45),
        value=5000.0,
        status="Upcoming"
    )
    renewal = service.create_renewal(db_session, data)
    
    updated = service.update_renewal_status(db_session, renewal.renewal_id, "Close Renewal", "Bob")
    assert updated.status == RenewalStatus.CLOSED
    
    summary = service.get_dashboard_summary(db_session)
    assert summary["closed"] >= 1
    assert summary["cancelled"] >= 1


def test_approval_workflow_auto_renew(db_session):
    data = RenewalCreate(
        contract_name="Workflow Contract",
        contract_id_ref="CNT-TEST-003",
        category="Security",
        vendor="Secure Co",
        owner="Charlie",
        expiry_date=datetime.utcnow() + timedelta(days=30),
        status="In Progress"
    )
    renewal = service.create_renewal(db_session, data)
    
    # Approve first step
    service.submit_approval(db_session, renewal.renewal_id, "Manager Review", "Approved", "Charlie", "Looks good")
    
    # Renewal should still be in progress until all steps approved
    db_session.refresh(renewal)
    assert renewal.status == RenewalStatus.IN_PROGRESS

    # Approve second step
    service.submit_approval(db_session, renewal.renewal_id, "Legal Approval", "Approved", "Legal Team", "Legal clear")
    
    db_session.refresh(renewal)
    assert renewal.status == RenewalStatus.RENEWED


def test_schedule_and_send_reminder(db_session):
    data = RenewalCreate(
        contract_name="Reminder Contract",
        contract_id_ref="CNT-TEST-004",
        category="ERP Software",
        vendor="ERP Soft",
        owner="David",
        expiry_date=datetime.utcnow() + timedelta(days=15),
        status="Upcoming"
    )
    renewal = service.create_renewal(db_session, data)
    
    reminder = service.schedule_reminder(db_session, renewal.renewal_id, datetime.utcnow() + timedelta(days=5), "Check contract terms")
    assert reminder.reminder_id is not None
    assert reminder.sent is False
    
    send_result = service.send_reminder_action(db_session, renewal.renewal_id)
    assert send_result["sent_count"] == 1

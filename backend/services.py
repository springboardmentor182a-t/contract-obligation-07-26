from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import date, timedelta, datetime
from typing import List, Optional
from models import (
    Renewal, RenewalApproval, RenewalReminder, RenewalHistory,
    Contract, User, RenewalStatus, ApprovalStatus, UserRole
)
from schemas import (
    RenewalCreate, RenewalUpdate, RenewalApprovalAction,
    CustomReminderCreate, RenewalStats
)
import random
import string


def generate_renewal_number() -> str:
    suffix = ''.join(random.choices(string.digits, k=6))
    return f"RNW-{datetime.now().year}-{suffix}"


def log_history(
    db: Session,
    renewal_id: int,
    action: str,
    old_status: Optional[str],
    new_status: Optional[str],
    changed_by: str,
    role: str,
    remarks: Optional[str] = None
):
    history = RenewalHistory(
        renewal_id=renewal_id,
        action=action,
        old_status=old_status,
        new_status=new_status,
        changed_by=changed_by,
        changed_by_role=role,
        remarks=remarks
    )
    db.add(history)


def schedule_reminders(db: Session, renewal: Renewal, manager_email: str):
    """Auto-schedule 30, 60, 90 day reminders before expiry."""
    for days in [90, 60, 30]:
        reminder_date = renewal.original_end_date - timedelta(days=days)
        if reminder_date >= date.today():
            reminder = RenewalReminder(
                renewal_id=renewal.id,
                reminder_type=f"{days}day",
                scheduled_date=reminder_date,
                recipient_email=manager_email,
                message=(
                    f"[ContractIQ] Renewal Alert: Contract '{renewal.contract.title}' "
                    f"(#{renewal.contract.contract_number}) is expiring in {days} days "
                    f"on {renewal.original_end_date}. Renewal #{renewal.renewal_number} "
                    f"requires your attention."
                )
            )
            db.add(reminder)


def create_renewal(db: Session, data: RenewalCreate, created_by: User) -> Renewal:
    contract = db.query(Contract).filter(Contract.id == data.contract_id).first()
    if not contract:
        raise ValueError("Contract not found")

    renewal = Renewal(
        renewal_number=generate_renewal_number(),
        contract_id=data.contract_id,
        manager_id=data.manager_id,
        original_end_date=data.original_end_date,
        proposed_end_date=data.proposed_end_date,
        renewal_value=data.renewal_value,
        notes=data.notes,
        priority=data.priority,
        status=RenewalStatus.upcoming
    )
    db.add(renewal)
    db.flush()  # get renewal.id

    # Create initial approval workflow step
    approval = RenewalApproval(
        renewal_id=renewal.id,
        approver_id=created_by.id,
        step=1,
        status=ApprovalStatus.pending
    )
    db.add(approval)

    # Schedule reminders
    manager = db.query(User).filter(User.id == data.manager_id).first()
    if manager:
        # Need contract relationship loaded
        renewal.contract = contract
        schedule_reminders(db, renewal, manager.email)

    log_history(
        db, renewal.id, "RENEWAL_CREATED", None, RenewalStatus.upcoming.value,
        created_by.full_name, created_by.role.value, "Renewal tracking initiated"
    )
    db.commit()
    db.refresh(renewal)
    return renewal


def get_renewals(
    db: Session,
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
) -> List[Renewal]:
    query = db.query(Renewal).join(Contract).join(User, Renewal.manager_id == User.id)

    if status_filter:
        query = query.filter(Renewal.status == status_filter)
    if priority_filter:
        query = query.filter(Renewal.priority == priority_filter)
    if search:
        query = query.filter(
            or_(
                Contract.title.ilike(f"%{search}%"),
                Contract.contract_number.ilike(f"%{search}%"),
                Contract.vendor_name.ilike(f"%{search}%"),
                Renewal.renewal_number.ilike(f"%{search}%")
            )
        )

    return query.order_by(Renewal.created_at.desc()).offset(skip).limit(limit).all()


def get_renewal_by_id(db: Session, renewal_id: int) -> Optional[Renewal]:
    return db.query(Renewal).filter(Renewal.id == renewal_id).first()


def update_renewal(
    db: Session, renewal_id: int, data: RenewalUpdate, updated_by: User
) -> Renewal:
    renewal = db.query(Renewal).filter(Renewal.id == renewal_id).first()
    if not renewal:
        raise ValueError("Renewal not found")

    old_status = renewal.status.value if renewal.status else None
    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(renewal, key, value)

    new_status = renewal.status.value if renewal.status else None
    action = "STATUS_CHANGED" if old_status != new_status else "RENEWAL_UPDATED"

    log_history(
        db, renewal_id, action, old_status, new_status,
        updated_by.full_name, updated_by.role.value,
        data.notes or "Renewal details updated"
    )

    db.commit()
    db.refresh(renewal)
    return renewal


def process_approval(
    db: Session, renewal_id: int, data: RenewalApprovalAction, approver: User
) -> RenewalApproval:
    approval = db.query(RenewalApproval).filter(
        and_(
            RenewalApproval.renewal_id == renewal_id,
            RenewalApproval.approver_id == approver.id,
            RenewalApproval.status == ApprovalStatus.pending
        )
    ).first()

    if not approval:
        raise ValueError("No pending approval found for this user")

    approval.status = data.status
    approval.comments = data.comments
    approval.decided_at = datetime.utcnow()

    renewal = db.query(Renewal).filter(Renewal.id == renewal_id).first()
    old_status = renewal.status.value

    if data.status == ApprovalStatus.approved:
        renewal.status = RenewalStatus.in_progress
        action = "APPROVAL_GRANTED"
        new_status = RenewalStatus.in_progress.value
    else:
        renewal.status = RenewalStatus.cancelled
        action = "APPROVAL_REJECTED"
        new_status = RenewalStatus.cancelled.value

    log_history(
        db, renewal_id, action, old_status, new_status,
        approver.full_name, approver.role.value, data.comments
    )

    db.commit()
    db.refresh(approval)
    return approval


def complete_renewal(
    db: Session, renewal_id: int, renewed_end_date: date, user: User
) -> Renewal:
    renewal = db.query(Renewal).filter(Renewal.id == renewal_id).first()
    if not renewal:
        raise ValueError("Renewal not found")

    old_status = renewal.status.value
    renewal.status = RenewalStatus.renewed
    renewal.renewed_end_date = renewed_end_date

    # Update contract end date too
    contract = db.query(Contract).filter(Contract.id == renewal.contract_id).first()
    if contract:
        contract.end_date = renewed_end_date

    log_history(
        db, renewal_id, "RENEWAL_COMPLETED", old_status, RenewalStatus.renewed.value,
        user.full_name, user.role.value,
        f"Contract renewed until {renewed_end_date}"
    )

    db.commit()
    db.refresh(renewal)
    return renewal


def get_stats(db: Session) -> RenewalStats:
    today = date.today()
    total = db.query(func.count(Renewal.id)).scalar() or 0

    counts = {}
    for status in RenewalStatus:
        counts[status.value] = (
            db.query(func.count(Renewal.id)).filter(Renewal.status == status).scalar() or 0
        )

    exp_30 = db.query(func.count(Renewal.id)).filter(
        and_(Renewal.original_end_date <= today + timedelta(days=30),
             Renewal.original_end_date >= today,
             Renewal.status.in_([RenewalStatus.upcoming, RenewalStatus.in_progress]))
    ).scalar() or 0

    exp_60 = db.query(func.count(Renewal.id)).filter(
        and_(Renewal.original_end_date <= today + timedelta(days=60),
             Renewal.original_end_date >= today,
             Renewal.status.in_([RenewalStatus.upcoming, RenewalStatus.in_progress]))
    ).scalar() or 0

    exp_90 = db.query(func.count(Renewal.id)).filter(
        and_(Renewal.original_end_date <= today + timedelta(days=90),
             Renewal.original_end_date >= today,
             Renewal.status.in_([RenewalStatus.upcoming, RenewalStatus.in_progress]))
    ).scalar() or 0

    total_value = db.query(func.sum(Renewal.renewal_value)).filter(
        Renewal.renewal_value != None
    ).scalar() or 0.0

    return RenewalStats(
        total=total,
        upcoming=counts.get("upcoming", 0),
        in_progress=counts.get("in_progress", 0),
        renewed=counts.get("renewed", 0),
        expired=counts.get("expired", 0),
        cancelled=counts.get("cancelled", 0),
        expiring_in_30_days=exp_30,
        expiring_in_60_days=exp_60,
        expiring_in_90_days=exp_90,
        total_renewal_value=float(total_value)
    )


def add_custom_reminder(
    db: Session, data: CustomReminderCreate, user: User
) -> RenewalReminder:
    renewal = db.query(Renewal).filter(Renewal.id == data.renewal_id).first()
    if not renewal:
        raise ValueError("Renewal not found")

    reminder = RenewalReminder(
        renewal_id=data.renewal_id,
        reminder_type="custom",
        scheduled_date=data.scheduled_date,
        recipient_email=data.recipient_email,
        message=data.message or f"Custom reminder for renewal {renewal.renewal_number}"
    )
    db.add(reminder)
    log_history(
        db, data.renewal_id, "REMINDER_SCHEDULED", None, None,
        user.full_name, user.role.value,
        f"Custom reminder scheduled for {data.scheduled_date}"
    )
    db.commit()
    db.refresh(reminder)
    return reminder


def check_and_mark_expired(db: Session):
    """Mark renewals as expired if past end date with no renewal."""
    today = date.today()
    expired_renewals = db.query(Renewal).filter(
        and_(
            Renewal.original_end_date < today,
            Renewal.status.in_([RenewalStatus.upcoming, RenewalStatus.in_progress])
        )
    ).all()

    for renewal in expired_renewals:
        old_status = renewal.status.value
        renewal.status = RenewalStatus.expired
        log_history(
            db, renewal.id, "AUTO_EXPIRED", old_status, RenewalStatus.expired.value,
            "System", "system", "Automatically expired — contract end date passed"
        )

    db.commit()
    return len(expired_renewals)

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from entities.renewal import (
    Renewal,
    RenewalApproval,
    RenewalReminder,
    RenewalHistory,
    RenewalStatus,
    ApprovalStatus,
)


def get_dashboard_summary(db: Session):
    """Get counts per status + expiring-soon-no-action count."""
    counts = {}
    for status in RenewalStatus:
        count = db.query(Renewal).filter(Renewal.status == status).count()
        counts[status.value] = count

    # Contracts expiring within 30 days with no renewal action started
    thirty_days = datetime.utcnow() + timedelta(days=30)
    expiring_soon = (
        db.query(Renewal)
        .filter(
            Renewal.expiry_date <= thirty_days,
            Renewal.expiry_date >= datetime.utcnow(),
            Renewal.status == RenewalStatus.UPCOMING,
        )
        .count()
    )

    # Total value at risk (upcoming + in progress contracts)
    value_at_risk = (
        db.query(sql_func.coalesce(sql_func.sum(Renewal.value), 0))
        .filter(
            Renewal.status.in_([RenewalStatus.UPCOMING, RenewalStatus.IN_PROGRESS])
        )
        .scalar()
    )

    return {
        "upcoming": counts.get("Upcoming", 0),
        "in_progress": counts.get("In Progress", 0),
        "renewed": counts.get("Renewed", 0),
        "expired": counts.get("Expired", 0),
        "cancelled": counts.get("Cancelled", 0),
        "expiring_soon_no_action": expiring_soon,
        "total_value_at_risk": float(value_at_risk or 0),
    }


def get_renewals(
    db: Session,
    search: str = None,
    category: str = None,
    status: str = None,
):
    """List renewals with optional filters. Computes days_until_expiry server-side."""
    query = db.query(Renewal)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Renewal.contract_name.ilike(search_term))
            | (Renewal.contract_id_ref.ilike(search_term))
            | (Renewal.vendor.ilike(search_term))
        )

    if category and category != "All":
        query = query.filter(Renewal.category == category)

    if status and status != "All":
        query = query.filter(Renewal.status == status)

    renewals = query.order_by(Renewal.expiry_date.asc()).all()

    result = []
    now = datetime.utcnow()
    for r in renewals:
        days_left = (r.expiry_date - now).days
        renewal_dict = {
            "renewal_id": r.renewal_id,
            "contract_name": r.contract_name,
            "contract_id_ref": r.contract_id_ref,
            "category": r.category,
            "vendor": r.vendor,
            "owner": r.owner,
            "expiry_date": r.expiry_date.isoformat(),
            "notice_period_days": r.notice_period_days,
            "value": r.value,
            "status": r.status.value if hasattr(r.status, "value") else r.status,
            "auto_renew": r.auto_renew,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            "days_until_expiry": days_left,
        }
        result.append(renewal_dict)

    return result


def create_renewal(db: Session, data):
    """Create a renewal record and its initial audit-history entry."""
    renewal = Renewal(**data.model_dump())
    db.add(renewal)
    db.flush()
    db.add(
        RenewalHistory(
            renewal_id=renewal.renewal_id,
            action="Renewal record created",
            performed_by=renewal.owner,
            details=f"Contract {renewal.contract_id_ref} added to renewal tracking",
        )
    )
    db.commit()
    db.refresh(renewal)
    return renewal


def get_renewal_detail(db: Session, renewal_id: int):
    """Get a single renewal with its approvals, reminders, and history."""
    renewal = (
        db.query(Renewal).filter(Renewal.renewal_id == renewal_id).first()
    )
    if not renewal:
        return None

    now = datetime.utcnow()
    days_left = (renewal.expiry_date - now).days

    return {
        "renewal_id": renewal.renewal_id,
        "contract_name": renewal.contract_name,
        "contract_id_ref": renewal.contract_id_ref,
        "category": renewal.category,
        "vendor": renewal.vendor,
        "owner": renewal.owner,
        "expiry_date": renewal.expiry_date.isoformat(),
        "notice_period_days": renewal.notice_period_days,
        "value": renewal.value,
        "status": renewal.status.value if hasattr(renewal.status, "value") else renewal.status,
        "auto_renew": renewal.auto_renew,
        "created_at": renewal.created_at.isoformat() if renewal.created_at else None,
        "updated_at": renewal.updated_at.isoformat() if renewal.updated_at else None,
        "days_until_expiry": days_left,
        "approvals": [
            {
                "approval_id": a.approval_id,
                "renewal_id": a.renewal_id,
                "step_name": a.step_name,
                "status": a.status.value if hasattr(a.status, "value") else a.status,
                "approver": a.approver,
                "comments": a.comments,
                "acted_at": a.acted_at.isoformat() if a.acted_at else None,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in renewal.approvals
        ],
        "reminders": [
            {
                "reminder_id": rm.reminder_id,
                "renewal_id": rm.renewal_id,
                "reminder_date": rm.reminder_date.isoformat(),
                "message": rm.message,
                "sent": rm.sent,
                "sent_at": rm.sent_at.isoformat() if rm.sent_at else None,
                "created_at": rm.created_at.isoformat() if rm.created_at else None,
            }
            for rm in renewal.reminders
        ],
        "history": [
            {
                "history_id": h.history_id,
                "renewal_id": h.renewal_id,
                "action": h.action,
                "performed_by": h.performed_by,
                "details": h.details,
                "created_at": h.created_at.isoformat() if h.created_at else None,
            }
            for h in sorted(renewal.history, key=lambda x: x.created_at, reverse=True)
        ],
    }


def update_renewal_status(db: Session, renewal_id: int, new_status: str, performed_by: str):
    """Update renewal status and log to history."""
    renewal = db.query(Renewal).filter(Renewal.renewal_id == renewal_id).first()
    if not renewal:
        return None

    old_status = renewal.status.value if hasattr(renewal.status, "value") else renewal.status
    renewal.status = new_status

    # Log to history
    history = RenewalHistory(
        renewal_id=renewal_id,
        action=f"Status changed from {old_status} to {new_status}",
        performed_by=performed_by,
        details=f"Renewal status updated by {performed_by}",
    )
    db.add(history)
    db.commit()
    db.refresh(renewal)

    return renewal


def submit_approval(db: Session, renewal_id: int, step_name: str, action: str, approver: str, comments: str = None):
    """Submit an approval action on a renewal."""
    renewal = db.query(Renewal).filter(Renewal.renewal_id == renewal_id).first()
    if not renewal:
        return None

    # Find or create the approval step
    approval = (
        db.query(RenewalApproval)
        .filter(
            RenewalApproval.renewal_id == renewal_id,
            RenewalApproval.step_name == step_name,
        )
        .first()
    )

    if not approval:
        approval = RenewalApproval(
            renewal_id=renewal_id,
            step_name=step_name,
            approver=approver,
            status=action,
            comments=comments,
            acted_at=datetime.utcnow(),
        )
        db.add(approval)
    else:
        approval.status = action
        approval.approver = approver
        approval.comments = comments
        approval.acted_at = datetime.utcnow()

    # Log to history
    history = RenewalHistory(
        renewal_id=renewal_id,
        action=f"Approval step '{step_name}' {action} by {approver}",
        performed_by=approver,
        details=comments or f"Step {step_name} marked as {action}",
    )
    db.add(history)

    # If approved at final step, update status to Renewed
    if action == "Approved":
        all_approvals = (
            db.query(RenewalApproval)
            .filter(RenewalApproval.renewal_id == renewal_id)
            .all()
        )
        all_approved = all(
            a.status == ApprovalStatus.APPROVED or a.approval_id == approval.approval_id
            for a in all_approvals
        )
        if all_approved and len(all_approvals) >= 2:
            renewal.status = RenewalStatus.RENEWED
            history2 = RenewalHistory(
                renewal_id=renewal_id,
                action="Renewal approved — status changed to Renewed",
                performed_by="System",
                details="All approval steps completed",
            )
            db.add(history2)

    # If rejected, keep status as In Progress
    if action == "Rejected":
        renewal.status = RenewalStatus.IN_PROGRESS

    db.commit()
    db.refresh(approval)
    return approval


def schedule_reminder(db: Session, renewal_id: int, reminder_date: datetime, message: str = None):
    """Schedule a reminder for a renewal."""
    renewal = db.query(Renewal).filter(Renewal.renewal_id == renewal_id).first()
    if not renewal:
        return None

    reminder = RenewalReminder(
        renewal_id=renewal_id,
        reminder_date=reminder_date,
        message=message or f"Reminder: Contract {renewal.contract_name} renewal due",
    )
    db.add(reminder)

    # Log to history
    history = RenewalHistory(
        renewal_id=renewal_id,
        action=f"Reminder scheduled for {reminder_date.strftime('%Y-%m-%d')}",
        performed_by="System",
        details=message or "Auto-scheduled reminder",
    )
    db.add(history)

    db.commit()
    db.refresh(reminder)
    return reminder


def send_reminder_action(db: Session, renewal_id: int):
    """Mark pending reminders as sent for a renewal."""
    reminders = (
        db.query(RenewalReminder)
        .filter(
            RenewalReminder.renewal_id == renewal_id,
            RenewalReminder.sent.is_(False),
        )
        .all()
    )

    if not reminders:
        return None

    for reminder in reminders:
        reminder.sent = True
        reminder.sent_at = datetime.utcnow()

    history = RenewalHistory(
        renewal_id=renewal_id,
        action=f"Reminder sent ({len(reminders)} notification(s))",
        performed_by="System",
        details="Renewal reminder notification sent",
    )
    db.add(history)

    db.commit()
    return {"sent_count": len(reminders)}

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


def seed_renewals(db: Session):
    """Seed the database with 15 realistic sample renewals."""
    # Clear existing data
    db.query(RenewalHistory).delete()
    db.query(RenewalReminder).delete()
    db.query(RenewalApproval).delete()
    db.query(Renewal).delete()
    db.commit()

    now = datetime.utcnow()

    renewals_data = [
        {
            "contract_name": "Microsoft Azure Enterprise Agreement",
            "contract_id_ref": "CNT-2025-001",
            "category": "Software License",
            "vendor": "Microsoft Corp",
            "owner": "Sarah Chen",
            "expiry_date": now + timedelta(days=210),
            "notice_period_days": 60,
            "value": 2400000.0,
            "status": RenewalStatus.UPCOMING,
            "auto_renew": False,
        },
        {
            "contract_name": "Salesforce CRM Platform License",
            "contract_id_ref": "CNT-2025-002",
            "category": "Software License",
            "vendor": "Salesforce Inc",
            "owner": "James Wilson",
            "expiry_date": now - timedelta(days=120),
            "notice_period_days": 45,
            "value": 890000.0,
            "status": RenewalStatus.EXPIRED,
            "auto_renew": False,
        },
        {
            "contract_name": "AWS Infrastructure Services",
            "contract_id_ref": "CNT-2025-003",
            "category": "Cloud Services",
            "vendor": "Amazon Web Services",
            "owner": "Michael Brown",
            "expiry_date": now + timedelta(days=15),
            "notice_period_days": 30,
            "value": 1560000.0,
            "status": RenewalStatus.IN_PROGRESS,
            "auto_renew": False,
        },
        {
            "contract_name": "Oracle Database Enterprise License",
            "contract_id_ref": "CNT-2025-004",
            "category": "Software License",
            "vendor": "Oracle Corporation",
            "owner": "Emily Davis",
            "expiry_date": now + timedelta(days=45),
            "notice_period_days": 60,
            "value": 680000.0,
            "status": RenewalStatus.IN_PROGRESS,
            "auto_renew": False,
        },
        {
            "contract_name": "ServiceNow ITSM Platform",
            "contract_id_ref": "CNT-2025-005",
            "category": "IT Services",
            "vendor": "ServiceNow Inc.",
            "owner": "David Martinez",
            "expiry_date": now - timedelta(days=30),
            "notice_period_days": 30,
            "value": 420000.0,
            "status": RenewalStatus.EXPIRED,
            "auto_renew": False,
        },
        {
            "contract_name": "Workday HCM Enterprise Suite",
            "contract_id_ref": "CNT-2025-006",
            "category": "HR Software",
            "vendor": "Workday Inc",
            "owner": "Lisa Anderson",
            "expiry_date": now - timedelta(days=200),
            "notice_period_days": 90,
            "value": 310000.0,
            "status": RenewalStatus.EXPIRED,
            "auto_renew": False,
        },
        {
            "contract_name": "Cisco Network Infrastructure",
            "contract_id_ref": "CNT-2025-007",
            "category": "Network Equipment",
            "vendor": "Cisco Systems",
            "owner": "Robert Taylor",
            "expiry_date": now + timedelta(days=540),
            "notice_period_days": 60,
            "value": 1850000.0,
            "status": RenewalStatus.UPCOMING,
            "auto_renew": True,
        },
        {
            "contract_name": "Adobe Creative Cloud Enterprise",
            "contract_id_ref": "CNT-2025-008",
            "category": "Software License",
            "vendor": "Adobe Systems",
            "owner": "Jennifer White",
            "expiry_date": now + timedelta(days=22),
            "notice_period_days": 30,
            "value": 180000.0,
            "status": RenewalStatus.UPCOMING,
            "auto_renew": False,
        },
        {
            "contract_name": "Slack Business+ Communication",
            "contract_id_ref": "CNT-2025-009",
            "category": "Communication",
            "vendor": "Salesforce (Slack)",
            "owner": "Sarah Chen",
            "expiry_date": now + timedelta(days=85),
            "notice_period_days": 30,
            "value": 95000.0,
            "status": RenewalStatus.UPCOMING,
            "auto_renew": True,
        },
        {
            "contract_name": "Zoom Enterprise Video Platform",
            "contract_id_ref": "CNT-2025-010",
            "category": "Communication",
            "vendor": "Zoom Video Communications",
            "owner": "Michael Brown",
            "expiry_date": now + timedelta(days=120),
            "notice_period_days": 30,
            "value": 145000.0,
            "status": RenewalStatus.RENEWED,
            "auto_renew": True,
        },
        {
            "contract_name": "SAP S/4HANA Cloud License",
            "contract_id_ref": "CNT-2025-011",
            "category": "ERP Software",
            "vendor": "SAP SE",
            "owner": "Emily Davis",
            "expiry_date": now + timedelta(days=60),
            "notice_period_days": 90,
            "value": 3200000.0,
            "status": RenewalStatus.IN_PROGRESS,
            "auto_renew": False,
        },
        {
            "contract_name": "Palo Alto Firewall Subscription",
            "contract_id_ref": "CNT-2025-012",
            "category": "Security",
            "vendor": "Palo Alto Networks",
            "owner": "Robert Taylor",
            "expiry_date": now + timedelta(days=350),
            "notice_period_days": 60,
            "value": 520000.0,
            "status": RenewalStatus.RENEWED,
            "auto_renew": True,
        },
        {
            "contract_name": "DocuSign eSignature Enterprise",
            "contract_id_ref": "CNT-2025-013",
            "category": "Software License",
            "vendor": "DocuSign Inc",
            "owner": "Lisa Anderson",
            "expiry_date": now + timedelta(days=8),
            "notice_period_days": 30,
            "value": 75000.0,
            "status": RenewalStatus.UPCOMING,
            "auto_renew": False,
        },
        {
            "contract_name": "Datadog Monitoring Platform",
            "contract_id_ref": "CNT-2025-014",
            "category": "IT Services",
            "vendor": "Datadog Inc",
            "owner": "David Martinez",
            "expiry_date": now + timedelta(days=200),
            "notice_period_days": 30,
            "value": 230000.0,
            "status": RenewalStatus.CANCELLED,
            "auto_renew": False,
        },
        {
            "contract_name": "Atlassian Jira & Confluence",
            "contract_id_ref": "CNT-2025-015",
            "category": "Software License",
            "vendor": "Atlassian",
            "owner": "James Wilson",
            "expiry_date": now + timedelta(days=180),
            "notice_period_days": 30,
            "value": 110000.0,
            "status": RenewalStatus.CANCELLED,
            "auto_renew": False,
        },
    ]

    created_renewals = []
    for data in renewals_data:
        renewal = Renewal(**data)
        db.add(renewal)
        db.flush()
        created_renewals.append(renewal)

    # Add approval steps for In Progress renewals
    in_progress_renewals = [r for r in created_renewals if r.status == RenewalStatus.IN_PROGRESS]
    for renewal in in_progress_renewals:
        steps = [
            RenewalApproval(
                renewal_id=renewal.renewal_id,
                step_name="Renewal Requested",
                status=ApprovalStatus.APPROVED,
                approver=renewal.owner,
                comments="Renewal initiated",
                acted_at=now - timedelta(days=5),
            ),
            RenewalApproval(
                renewal_id=renewal.renewal_id,
                step_name="Under Review",
                status=ApprovalStatus.PENDING,
                approver="Legal Department",
                comments=None,
            ),
            RenewalApproval(
                renewal_id=renewal.renewal_id,
                step_name="Final Approval",
                status=ApprovalStatus.PENDING,
                approver="Finance Director",
                comments=None,
            ),
        ]
        for step in steps:
            db.add(step)

    # Add approval steps for Renewed contracts (all approved)
    renewed_renewals = [r for r in created_renewals if r.status == RenewalStatus.RENEWED]
    for renewal in renewed_renewals:
        steps = [
            RenewalApproval(
                renewal_id=renewal.renewal_id,
                step_name="Renewal Requested",
                status=ApprovalStatus.APPROVED,
                approver=renewal.owner,
                comments="Renewal initiated",
                acted_at=now - timedelta(days=30),
            ),
            RenewalApproval(
                renewal_id=renewal.renewal_id,
                step_name="Under Review",
                status=ApprovalStatus.APPROVED,
                approver="Legal Department",
                comments="Terms reviewed and accepted",
                acted_at=now - timedelta(days=20),
            ),
            RenewalApproval(
                renewal_id=renewal.renewal_id,
                step_name="Final Approval",
                status=ApprovalStatus.APPROVED,
                approver="Finance Director",
                comments="Budget approved",
                acted_at=now - timedelta(days=10),
            ),
        ]
        for step in steps:
            db.add(step)

    # Add history entries
    for renewal in created_renewals:
        history = RenewalHistory(
            renewal_id=renewal.renewal_id,
            action="Renewal record created",
            performed_by="System",
            details=f"Contract {renewal.contract_id_ref} added to renewal tracking",
            created_at=now - timedelta(days=60),
        )
        db.add(history)

        if renewal.status == RenewalStatus.IN_PROGRESS:
            db.add(
                RenewalHistory(
                    renewal_id=renewal.renewal_id,
                    action="Status changed to In Progress",
                    performed_by=renewal.owner,
                    details="Renewal process initiated",
                    created_at=now - timedelta(days=5),
                )
            )

        if renewal.status == RenewalStatus.RENEWED:
            db.add(
                RenewalHistory(
                    renewal_id=renewal.renewal_id,
                    action="Status changed to Renewed",
                    performed_by="System",
                    details="All approval steps completed — contract renewed",
                    created_at=now - timedelta(days=10),
                )
            )

        if renewal.status == RenewalStatus.EXPIRED:
            db.add(
                RenewalHistory(
                    renewal_id=renewal.renewal_id,
                    action="Status changed to Expired",
                    performed_by="System",
                    details="Contract expired — no renewal action taken before deadline",
                    created_at=renewal.expiry_date,
                )
            )

    # Add some reminders
    for renewal in created_renewals[:5]:
        reminder = RenewalReminder(
            renewal_id=renewal.renewal_id,
            reminder_date=renewal.expiry_date - timedelta(days=renewal.notice_period_days),
            message=f"Renewal reminder: {renewal.contract_name} expires on {renewal.expiry_date.strftime('%Y-%m-%d')}",
            sent=renewal.status in [RenewalStatus.EXPIRED, RenewalStatus.RENEWED],
            sent_at=now - timedelta(days=15) if renewal.status in [RenewalStatus.EXPIRED, RenewalStatus.RENEWED] else None,
        )
        db.add(reminder)

    db.commit()
    return {"message": f"Seeded {len(created_renewals)} renewals with approvals, history, and reminders"}

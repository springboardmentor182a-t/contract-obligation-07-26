from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.database.models import Notification, User
from typing import Optional, List
from datetime import datetime, timedelta
import uuid

router = APIRouter()

def ensure_initial_notifications(db: Session, user_email: Optional[str] = None):
    """Seed initial realistic enterprise notifications if table is empty"""
    count = db.query(Notification).count()
    if count == 0:
        now = datetime.utcnow()
        sample_notifs = [
            # --- New / Today ---
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="renewal",
                title="Action Required: TechFlow Inc MSA Expiring",
                message="TechFlow Inc MSA (CTR-2026-002) is expiring in 15 days. Action required for contract renewal.",
                details="The Master Services Agreement CTR-2026-002 with TechFlow Inc is scheduled to expire in 15 days. Review commercial terms and initiate vendor renewal discussions before expiration.",
                link="/renewals",
                is_read=False,
                created_at=now - timedelta(minutes=25)
            ),
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="risk",
                title="High Risk Clause Detected: Unlimited Liability",
                message="SecureNet agreement flagged for non-standard indemnification and liability exposure.",
                details="AI Contract Risk Scanner detected clause 14.2 in the SecureNet contract lacks standard limitation of liability caps. VP Legal approval recommended prior to signing.",
                link="/contracts",
                is_read=False,
                created_at=now - timedelta(hours=1, minutes=45)
            ),
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="obligation",
                title="Upcoming Milestone Deadline: Quarterly True-up",
                message="Quarterly True-up Report obligation for Acme Corp is due in 3 days.",
                details="Obligation OBL-001 requires submission of audited usage reports to Acme Corp before end of week to maintain SLA compliance.",
                link="/obligations",
                is_read=False,
                created_at=now - timedelta(hours=3, minutes=10)
            ),
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="system",
                title="PostgreSQL Automated Backup Completed",
                message="ContractIQ PostgreSQL database snapshot verified and encrypted in secure vault.",
                details="Daily database snapshot completed with 0 errors. All contract tables, audit logs, and obligation records successfully indexed and archived in PostgreSQL.",
                link="/audit-logs",
                is_read=False,
                created_at=now - timedelta(hours=5)
            ),
            # --- Earlier / Yesterday ---
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="approval",
                title="Contract SOW Approved by Legal Review",
                message="Initech Statement of Work (SOW-2026-08) has been approved by Legal Review.",
                details="Legal compliance and risk review completed with zero objections. The agreement is now moved to Pending Signature status.",
                link="/contracts",
                is_read=True,
                created_at=now - timedelta(days=1, hours=2)
            ),
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="renewal",
                title="Vendor Agreement Auto-Renewal Notice",
                message="Global Logistics agreement (CTR-2026-003) auto-renews in 30 days.",
                details="Notice window for renegotiation or contract termination closes at the end of the current billing cycle. Current annual value: $150,000.",
                link="/renewals",
                is_read=True,
                created_at=now - timedelta(days=1, hours=6)
            ),
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="system",
                title="SOC2 Compliance Audit Cleared",
                message="Q2 Security and Compliance Audit signed off by Enterprise Security Officer.",
                details="The quarterly compliance audit has been verified with 100% adherence score. All obligation audit logs are synced in the database.",
                link="/compliance",
                is_read=True,
                created_at=now - timedelta(days=1, hours=11)
            ),
            # --- Earlier / Older ---
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="approval",
                title="Mutual NDA Executed: Globex Inc",
                message="Globex Inc NDA (CTR-2026-002) is now fully executed and archived.",
                details="Both parties completed electronic signatures. Document encrypted and indexed in the secure PostgreSQL contract repository.",
                link="/contracts",
                is_read=True,
                created_at=now - timedelta(days=3, hours=4)
            ),
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="obligation",
                title="Deliverable Phase 1 Acceptance Completed",
                message="Deliverable 1 Approval obligation marked completed by stakeholder.",
                details="Milestone payment of $75,000 has been cleared for processing following formal acceptance verification.",
                link="/obligations",
                is_read=True,
                created_at=now - timedelta(days=5, hours=8)
            ),
            Notification(
                notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
                user_id=user_email or "all",
                type="renewal",
                title="Umbrella Corp MSA Terminated / Replaced",
                message="Expired MSA replaced with new Enterprise Master Agreement.",
                details="Previous contract CTR-2026-005 archived following completion of migration to unified enterprise tier.",
                link="/renewals",
                is_read=True,
                created_at=now - timedelta(days=7, hours=14)
            )
        ]
        db.add_all(sample_notifs)
        db.commit()

def serialize_notification(n: Notification) -> dict:
    return {
        "id": n.id,
        "notification_id": n.notification_id,
        "user_id": n.user_id,
        "type": n.type,
        "title": n.title,
        "message": n.message,
        "details": n.details,
        "link": n.link,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat() if n.created_at else datetime.utcnow().isoformat()
    }

@router.get("")
@router.get("/")
def get_notifications(
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    GET /api/notifications
    Fetch all notifications from the PostgreSQL notifications table.
    """
    ensure_initial_notifications(db, user_id)
    
    # Query PostgreSQL notifications table
    query = db.query(Notification)
    if user_id and user_id.lower() not in ["all", "admin", "admin user"]:
        user_clean = user_id.strip().lower()
        query = query.filter(
            (Notification.user_id == user_clean) | 
            (Notification.user_id == user_id) | 
            (Notification.user_id == "all") | 
            (Notification.user_id == "demo@contractiq.com") |
            (Notification.user_id.is_(None))
        )
        
    notifications = query.order_by(Notification.created_at.desc()).all()
    return [serialize_notification(n) for n in notifications]

@router.put("/read-all")
def mark_all_as_read(
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    PUT /api/notifications/read-all
    Mark all unread notifications in PostgreSQL as read.
    """
    query = db.query(Notification).filter(Notification.is_read == False)
    if user_id and user_id.lower() not in ["all", "admin", "admin user"]:
        user_clean = user_id.strip().lower()
        query = query.filter(
            (Notification.user_id == user_clean) | 
            (Notification.user_id == user_id) | 
            (Notification.user_id == "all") | 
            (Notification.user_id == "demo@contractiq.com") |
            (Notification.user_id.is_(None))
        )
        
    unread_notifs = query.all()
    count = len(unread_notifs)
    for n in unread_notifs:
        n.is_read = True
        
    db.commit()
    return {
        "status": "success",
        "message": f"Marked {count} notifications as read in PostgreSQL database",
        "updated_count": count
    }

@router.put("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db)
):
    """
    PUT /api/notifications/{id}/read
    Mark a specific notification as read in the PostgreSQL database.
    """
    n = None
    if notification_id.isdigit():
        n = db.query(Notification).filter(Notification.id == int(notification_id)).first()
    
    if not n:
        n = db.query(Notification).filter(Notification.notification_id == notification_id).first()
        
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found in database")
        
    n.is_read = True
    db.commit()
    db.refresh(n)
    return serialize_notification(n)

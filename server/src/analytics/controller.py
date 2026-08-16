from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from pydantic import BaseModel, ConfigDict
from typing import List, Optional

from src.auth.dependencies import DASHBOARD_ROLES, require_roles
from src.database.core import get_db
from src.database.models import (
    AnalyticsSnapshot, MonthlyVolume, User, Notification
)
from src.contract_repository.models import Contract
from src.renewals.models import Renewal

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
    dependencies=[Depends(require_roles(*DASHBOARD_ROLES))],
)


class MetricResponse(BaseModel):
    label: str
    value: str
    trend: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class MonthlyVolumeResponse(BaseModel):
    month: str
    value: int
    model_config = ConfigDict(from_attributes=True)


class DashboardSummaryResponse(BaseModel):
    total_users: int
    total_contracts: int
    pending_approvals: int
    compliance_score: str
    active_contracts: int
    expired_contracts: int
    high_risk_count: int
    unread_notifications: int
    renewals_due: int
    storage_used: str
    user_name: str
    user_role: str


@router.get("/metrics", response_model=List[MetricResponse])
def get_metrics(db: Session = Depends(get_db)):
    result = db.execute(select(AnalyticsSnapshot).order_by(AnalyticsSnapshot.id.asc()))
    items = result.scalars().all()
    return [
        MetricResponse(label=item.label, value=item.value, trend=item.trend)
        for item in items
    ]


@router.get("/monthly-volume", response_model=List[MonthlyVolumeResponse])
def get_monthly_volume(db: Session = Depends(get_db)):
    import datetime
    
    today = datetime.date.today()
    months = []
    for i in range(6, -1, -1):
        m = today.month - i
        y = today.year
        if m <= 0:
            m += 12
            y -= 1
        months.append(datetime.date(y, m, 1).strftime("%b"))
        
    counts = {m: 0 for m in months}
    
    contracts = db.execute(select(Contract.created_at)).scalars().all()
    for dt in contracts:
        if dt:
            m_str = dt.strftime("%b")
            if m_str in counts:
                counts[m_str] += 1
                
    return [MonthlyVolumeResponse(month=m, value=counts[m]) for m in months]


@router.get("/dashboard-summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: User = Depends(require_roles(*DASHBOARD_ROLES)),
    db: Session = Depends(get_db),
):
    """Return live dashboard KPIs for the logged-in user (identified by JWT)."""

    user_name = (
        current_user.full_name
        or current_user.name
        or current_user.email
    )
    user_role = current_user.role

    # ── Aggregate counts directly from DB tables ──────────────────────────────
    total_users = db.execute(select(func.count()).select_from(User)).scalar() or 0

    # Unread notifications (global count — no per-user filtering yet)
    unread_notifications = db.execute(
        select(func.count())
        .select_from(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
    ).scalar() or 0

    # Pull analytics snapshot key-value store
    snapshots: dict = {}
    for snap in db.execute(select(AnalyticsSnapshot)).scalars().all():
        snapshots[snap.label.lower().replace(" ", "_")] = snap.value

    # Fetch actual contract metrics
    total_contracts = db.execute(select(func.count()).select_from(Contract)).scalar() or 0

    active_contracts = db.execute(
        select(func.count()).select_from(Contract).where(func.lower(Contract.status) == "active")
    ).scalar() or 0

    expired_contracts = db.execute(
        select(func.count()).select_from(Contract).where(func.lower(Contract.status) == "expired")
    ).scalar() or 0

    pending_approvals = db.execute(
        select(func.count()).select_from(Contract).where(func.lower(Contract.status) == "pending")
    ).scalar() or 0

    high_risk = db.execute(
        select(func.count()).select_from(Contract).where(func.lower(Contract.risk_level) == "high")
    ).scalar() or 0

    renewals_due = db.execute(
        select(func.count()).select_from(Renewal).where(func.lower(Renewal.status) != "completed")
    ).scalar() or 0

    # Compliance score from snapshot
    compliance_score = snapshots.get("compliance_score", "84%")
    if not str(compliance_score).endswith("%"):
        compliance_score = f"{compliance_score}%"

    return DashboardSummaryResponse(
        total_users=total_users,
        total_contracts=total_contracts,
        pending_approvals=pending_approvals,
        compliance_score=compliance_score,
        active_contracts=active_contracts,
        expired_contracts=expired_contracts,
        high_risk_count=high_risk,
        unread_notifications=unread_notifications,
        renewals_due=renewals_due,
        storage_used="73%",
        user_name=user_name,
        user_role=user_role,
    )

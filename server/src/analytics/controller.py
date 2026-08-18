from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from pydantic import BaseModel, ConfigDict
from typing import List, Optional

from src.auth.dependencies import DASHBOARD_ROLES, require_roles
from src.database.core import get_db
from src.database.models import (
    AnalyticsSnapshot,
    MonthlyVolume,
    User,
    Notification,
    ComplianceControl,
)
from src.contract_repository.models import Contract, ContractDocument
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


class RiskBucketResponse(BaseModel):
    key: str
    value: int
    percentage: float
    color: str


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
    risk_distribution: List[RiskBucketResponse] = []


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
    result = db.execute(select(MonthlyVolume).order_by(MonthlyVolume.sort_order.asc()))
    items = result.scalars().all()
    return [MonthlyVolumeResponse(month=item.month, value=item.value) for item in items]


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

    total_users = db.execute(select(func.count()).select_from(User)).scalar() or 0
    total_contracts = db.execute(select(func.count()).select_from(Contract)).scalar() or 0
    active_contracts = db.execute(
        select(func.count()).select_from(Contract).where(Contract.status == "Active")
    ).scalar() or 0
    expired_contracts = db.execute(
        select(func.count()).select_from(Contract).where(Contract.status == "Expired")
    ).scalar() or 0

    pending_approvals = db.execute(
        select(func.count())
        .select_from(Renewal)
        .where(
            Renewal.approval_status.in_(["Pending", "Awaiting Approval", "Submitted"])
        )
    ).scalar() or 0

    high_risk_count = db.execute(
        select(func.count())
        .select_from(Contract)
        .where(Contract.risk_level.in_(["High", "Critical"]))
    ).scalar() or 0

    unread_notifications = db.execute(
        select(func.count())
        .select_from(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
    ).scalar() or 0

    today = date.today()
    renewals_due = db.execute(
        select(func.count())
        .select_from(Renewal)
        .where(
            Renewal.expiry_date.is_not(None),
            Renewal.expiry_date >= today,
            Renewal.expiry_date <= today + timedelta(days=30),
        )
    ).scalar() or 0

    compliance_controls = db.execute(select(ComplianceControl)).scalars().all()
    if compliance_controls:
        total_weight = sum((control.weight or 0) for control in compliance_controls)
        score = round(total_weight / len(compliance_controls)) if len(compliance_controls) else 100
        compliance_score = f"{score}%"
    else:
        compliance_score = "100%"

    total_storage_bytes = db.execute(
        select(func.coalesce(func.sum(ContractDocument.file_size), 0))
        .select_from(ContractDocument)
    ).scalar() or 0
    storage_used = "0%"
    if total_storage_bytes > 0:
        storage_percent = min(100, round((total_storage_bytes / (250 * 1024 * 1024 * 1024)) * 100, 1))
        storage_used = f"{storage_percent}%"

    risk_distribution = []
    risk_levels = [
        ("Low", "#10B981"),
        ("Medium", "#F59E0B"),
        ("High", "#EF4444"),
        ("Critical", "#8B5CF6"),
    ]
    for risk_label, color in risk_levels:
        value = db.execute(
            select(func.count())
            .select_from(Contract)
            .where(Contract.risk_level == risk_label)
        ).scalar() or 0
        percentage = round((value / total_contracts) * 100, 1) if total_contracts else 0.0
        risk_distribution.append(
            {"key": risk_label, "value": value, "percentage": percentage, "color": color}
        )

    return DashboardSummaryResponse(
        total_users=total_users,
        total_contracts=total_contracts,
        pending_approvals=pending_approvals,
        compliance_score=compliance_score,
        active_contracts=active_contracts,
        expired_contracts=expired_contracts,
        high_risk_count=high_risk_count,
        unread_notifications=unread_notifications,
        renewals_due=renewals_due,
        storage_used=storage_used,
        user_name=user_name,
        user_role=user_role,
        risk_distribution=risk_distribution,
    )

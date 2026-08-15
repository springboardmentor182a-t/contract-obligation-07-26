from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from src.auth.dependencies import QUICK_ACTION_ROLES, require_roles
from src.audit.service import create_audit_log
from src.database.core import get_db
from src.database.models import QuickAction, QuickActionLog, User

router = APIRouter(
    prefix="/quick-actions",
    tags=["Quick Actions"],
    dependencies=[Depends(require_roles(*QUICK_ACTION_ROLES))],
)


class QuickActionResponse(BaseModel):
    id: str
    label: str
    desc: str
    icon: str
    color: str

    model_config = ConfigDict(from_attributes=True)


class QuickActionLogResponse(BaseModel):
    id: int
    label: str
    time: str
    status: str


class ExecutePayload(BaseModel):
    action_id: str


@router.get("", response_model=List[QuickActionResponse])
def list_quick_actions(db: Session = Depends(get_db)):
    items = db.execute(select(QuickAction).order_by(QuickAction.id.asc())).scalars().all()
    return [
        QuickActionResponse(
            id=item.id,
            label=item.label,
            desc=item.description or "",
            icon=item.icon or "Zap",
            color=item.color or "#3B82F6"
        )
        for item in items
    ]


@router.get("/logs", response_model=List[QuickActionLogResponse])
def get_logs(db: Session = Depends(get_db)):
    items = db.execute(
        select(QuickActionLog)
        .options(selectinload(QuickActionLog.action))
        .order_by(QuickActionLog.id.desc())
        .limit(8)
    ).scalars().all()

    return [
        QuickActionLogResponse(
            id=item.id,
            label=item.action.label if item.action else "Unknown Action",
            time="Just now",
            status=item.status
        )
        for item in items
    ]


@router.post("/execute", response_model=QuickActionLogResponse)
def execute_action(
    payload: ExecutePayload,
    current_user: User = Depends(require_roles(*QUICK_ACTION_ROLES)),
    db: Session = Depends(get_db),
):
    user_id = current_user.id
    action = db.execute(select(QuickAction).where(QuickAction.id == payload.action_id)).scalars().first()
    if not action:
        raise HTTPException(status_code=404, detail="Quick Action workflow not found")

    log = QuickActionLog(
        quick_action_id=payload.action_id,
        user_id=user_id,
        status="Success"
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="CREATE",
        action="Quick Action Executed",
        module="Quick Actions",
        description=(
            f"Executed quick action: {action.label} "
            f"(action ID: {action.id}, execution log ID: {log.id}, "
            f"status: {log.status})"
        ),
    )

    return QuickActionLogResponse(
        id=log.id,
        label=action.label,
        time="Just now",
        status=log.status
    )

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, ConfigDict
from typing import List
from src.database.core import get_db
from src.database.models import QuickAction, QuickActionLog

router = APIRouter(prefix="/quick-actions", tags=["Quick Actions"])

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
async def list_quick_actions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(QuickAction).order_by(QuickAction.id.asc()))
    items = result.scalars().all()
    return [
        QuickActionResponse(
            id=item.id,
            label=item.label,
            desc=item.description,
            icon=item.icon,
            color=item.color
        )
        for item in items
    ]

@router.get("/logs", response_model=List[QuickActionLogResponse])
async def get_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(QuickActionLog)
        .options(selectinload(QuickActionLog.action))
        .order_by(QuickActionLog.id.desc())
        .limit(8)
    )
    items = result.scalars().all()
    
    return [
        QuickActionLogResponse(
            id=item.id,
            label=item.action.label if item.action else "Unknown Action",
            time="Just now" if (func_now_diff := True) else item.executed_at.strftime("%H:%M"),
            status=item.status
        )
        for item in items
    ]

@router.post("/execute", response_model=QuickActionLogResponse)
async def execute_action(payload: ExecutePayload, db: AsyncSession = Depends(get_db)):
    # Verify action exists
    result = await db.execute(select(QuickAction).where(QuickAction.id == payload.action_id))
    action = result.scalars().first()
    if not action:
        raise HTTPException(status_code=404, detail="Quick Action workflow not found")

    # Log execution
    log = QuickActionLog(
        quick_action_id=payload.action_id,
        user_id=1,
        status="Success"
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)

    return QuickActionLogResponse(
        id=log.id,
        label=action.label,
        time="Just now",
        status=log.status
    )

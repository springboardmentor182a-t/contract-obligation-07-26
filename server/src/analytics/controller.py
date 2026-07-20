from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from src.database.core import get_db
from src.database.models import AnalyticsSnapshot, MonthlyVolume

router = APIRouter(prefix="/analytics", tags=["Analytics"])

class MetricResponse(BaseModel):
    label: str
    value: str
    trend: Optional[str] = None

    
    model_config = ConfigDict(from_attributes=True)

class MonthlyVolumeResponse(BaseModel):
    month: str
    value: int

    model_config = ConfigDict(from_attributes=True)

@router.get("/metrics", response_model=List[MetricResponse])
async def get_metrics(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AnalyticsSnapshot).order_by(AnalyticsSnapshot.id.asc()))
    items = result.scalars().all()
    return [
        MetricResponse(
            label=item.label,
            value=item.value,
            trend=item.trend
        )
        for item in items
    ]

@router.get("/monthly-volume", response_model=List[MonthlyVolumeResponse])
async def get_monthly_volume(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MonthlyVolume).order_by(MonthlyVolume.sort_order.asc()))
    items = result.scalars().all()
    return [
        MonthlyVolumeResponse(
            month=item.month,
            value=item.value
        )
        for item in items
    ]

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.core import get_db
from .schemas import RenewalCreate
from .service import service

router = APIRouter(
    prefix="/renewals",
    tags=["Renewals"]
)


@router.get("/")
async def get_all(
    db: AsyncSession = Depends(get_db)
):
    return await service.get_all(db)


@router.post("/")
async def create(
    renewal: RenewalCreate,
    db: AsyncSession = Depends(get_db)
):
    return await service.create(db, renewal)


@router.get("/raw")
async def get_raw_renewals(
    db: AsyncSession = Depends(get_db)
):
    return await service.get_all(db)


@router.get("/dashboard")
async def dashboard(
    db: AsyncSession = Depends(get_db)
):
    return await service.dashboard(db)
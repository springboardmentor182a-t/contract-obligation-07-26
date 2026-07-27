from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.core import get_db
from .schemas import RenewalCreate
from .service import service

router = APIRouter(
    prefix="/renewals",
    tags=["Renewals"]
)

@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return service.get_all(db)

@router.post("/")
def create(
    renewal: RenewalCreate,
    db: Session = Depends(get_db)
):
    return service.create(db, renewal)

@router.get("/raw")
def get_raw_renewals(
    db: Session = Depends(get_db)
):
    return service.get_all(db)

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db)
):
    return service.dashboard(db)
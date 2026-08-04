from datetime import date
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


@router.get("/upcoming")
def upcoming_renewals(db: Session = Depends(get_db)):
    """Returns renewals expiring within 90 days — used by Notifications sidebar."""
    renewals = service.repo.get_all(db)
    today = date.today()
    result = []
    for r in renewals:
        expiry = getattr(r, "expiry_date", None)
        if not expiry:
            continue
        days_left = (expiry - today).days
        if 0 <= days_left <= 90:
            result.append({
                "code": f"CTR-{r.id:03d}",
                "name": getattr(r, "contract_name", None) or getattr(r, "vendor", None) or "Unnamed",
                "daysLeft": days_left,
            })
    result.sort(key=lambda x: x["daysLeft"])
    return result[:10]

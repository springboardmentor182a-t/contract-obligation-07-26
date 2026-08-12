from datetime import date
from fastapi import APIRouter, Depends

from src.auth.dependencies import ALL_ROLES, RENEWAL_ROLES, require_roles
from src.database.core import get_db
from .schemas import RenewalCreate
from .service import service

router = APIRouter(
    prefix="/renewals",
    tags=["Renewals"],
)


@router.get(
    "/",
    dependencies=[Depends(require_roles(*RENEWAL_ROLES))],
)
def get_all(
    db=Depends(get_db)
):
    return service.get_all(db)


@router.post(
    "/",
    dependencies=[Depends(require_roles(*RENEWAL_ROLES))],
)
def create(
    renewal: RenewalCreate,
    db=Depends(get_db)
):
    return service.create(db, renewal)


@router.get(
    "/raw",
    dependencies=[Depends(require_roles(*RENEWAL_ROLES))],
)
def get_raw_renewals(
    db=Depends(get_db)
):
    return service.get_all(db)


@router.get(
    "/dashboard",
    dependencies=[Depends(require_roles(*RENEWAL_ROLES))],
)
def dashboard(
    db=Depends(get_db)
):
    return service.dashboard(db)


@router.get(
    "/upcoming",
    dependencies=[Depends(require_roles(*ALL_ROLES))],
)
def upcoming_renewals(db=Depends(get_db)):
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
                "name": r.contract_name or r.vendor or "Unnamed",
                "daysLeft": days_left,
            })
    result.sort(key=lambda x: x["daysLeft"])
    return result[:10]

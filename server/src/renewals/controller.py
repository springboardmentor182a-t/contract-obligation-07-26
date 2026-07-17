from fastapi import APIRouter
#from src.renewals.service import get_all_renewals
from src.renewals.service import (
    get_all_renewals,
    update_renewal
)
router = APIRouter(
    prefix="/renewals",
    tags=["Renewals"]
)


@router.get("/")
def list_renewals():
    return get_all_renewals()
@router.put("/{id}")
def edit_renewal(id: int, renewal: dict):
    return update_renewal(id, renewal)
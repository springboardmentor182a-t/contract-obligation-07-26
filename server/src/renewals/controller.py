from fastapi import APIRouter, HTTPException
from src.renewals.service import (
    get_all_renewals,
    get_renewal_by_id,
    create_renewal,
    update_renewal,
    delete_renewal,
)
from src.entities.renewal import Renewal

router = APIRouter()


@router.get("/renewals")
def get_renewals():
    return get_all_renewals()


@router.get("/renewals/{renewal_id}")
def get_renewal(renewal_id: str):
    renewal = get_renewal_by_id(renewal_id)

    if renewal is None:
        raise HTTPException(
            status_code=404,
            detail="Renewal not found"
        )

    return renewal


@router.post("/renewals")
def add_renewal(renewal: Renewal):
    return create_renewal(renewal)


@router.put("/renewals/{renewal_id}")
def edit_renewal(renewal_id: str, renewal: Renewal):
    updated = update_renewal(renewal_id, renewal)

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Renewal not found"
        )

    return updated


@router.delete("/renewals/{renewal_id}")
def remove_renewal(renewal_id: str):
    deleted = delete_renewal(renewal_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Renewal not found"
        )

    return deleted
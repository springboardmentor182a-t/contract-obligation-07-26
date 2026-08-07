from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from src.database.core import get_db
from src.entities.obligation import Obligation


router = APIRouter(
    prefix="/obligations",
    tags=["Obligations"]
)


@router.get("/")
def get_all_obligations(
    contract_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all obligations, optionally filtered by contract_id."""
    query = db.query(Obligation)

    if contract_id:
        query = query.filter(Obligation.contract_id == contract_id)

    return query.order_by(Obligation.obligation_id.desc()).all()


@router.get("/{obligation_id}")
def get_obligation(
    obligation_id: int,
    db: Session = Depends(get_db)
):
    """Get a single obligation by ID."""
    obligation = db.query(Obligation).filter(
        Obligation.obligation_id == obligation_id
    ).first()

    if not obligation:
        raise HTTPException(
            status_code=404,
            detail=f"Obligation with ID {obligation_id} not found"
        )

    return obligation

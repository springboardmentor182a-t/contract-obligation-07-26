from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from src.database.core import get_db
from src.entities.obligation import Obligation
from src.obligations.models import ObligationCreate, ObligationResponse, ObligationUpdate

router = APIRouter(prefix="/obligations", tags=["Obligations"])


@router.post("", response_model=ObligationResponse, status_code=status.HTTP_201_CREATED)
def create_obligation(obligation: ObligationCreate, db: Session = Depends(get_db)):
    """Create a new obligation."""
    new_obligation = Obligation(**obligation.model_dump())
    db.add(new_obligation)
    try:
        db.commit()
        db.refresh(new_obligation)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to create obligation: {str(e)}"
        )
    return new_obligation


@router.get("")
def get_all_obligations(
    contract_id: Optional[int] = None, db: Session = Depends(get_db)
):
    """Get all obligations, optionally filtered by contract_id."""
    query = db.query(Obligation)

    if contract_id:
        query = query.filter(Obligation.contract_id == contract_id)

    return query.order_by(Obligation.obligation_id.desc()).all()


@router.get("/{obligation_id}")
def get_obligation(obligation_id: int, db: Session = Depends(get_db)):
    """Get a single obligation by ID."""
    obligation = (
        db.query(Obligation).filter(Obligation.obligation_id == obligation_id).first()
    )

    if not obligation:
        raise HTTPException(
            status_code=404, detail=f"Obligation with ID {obligation_id} not found"
        )

    return obligation


@router.put("/{obligation_id}", response_model=ObligationResponse)
def update_obligation(
    obligation_id: int, obligation: ObligationUpdate, db: Session = Depends(get_db)
):
    """Update an existing obligation."""
    db_obligation = (
        db.query(Obligation).filter(Obligation.obligation_id == obligation_id).first()
    )

    if not db_obligation:
        raise HTTPException(
            status_code=404, detail=f"Obligation with ID {obligation_id} not found"
        )

    update_data = obligation.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obligation, key, value)
        
        # update completed status if progress reached 100% or similar logic is needed
        # (Assuming frontend handles this via status="Completed" or completed=True)

    try:
        db.commit()
        db.refresh(db_obligation)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to update obligation: {str(e)}"
        )

    return db_obligation

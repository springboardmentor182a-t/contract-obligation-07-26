from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.obligations.schemas import (
    ObligationResponse,
    ObligationUpdate,
)
from src.obligations.service import ObligationService

router = APIRouter(
    prefix="/obligations",
    tags=["Obligations"],
)


@router.get("/", response_model=list[ObligationResponse])
def get_obligations(db: Session = Depends(get_db)):
    return ObligationService.get_all_obligations(db)


@router.patch(
    "/{obligation_id}",
    response_model=ObligationResponse,
)
def update_obligation(
    obligation_id: int,
    obligation_data: ObligationUpdate,
    db: Session = Depends(get_db),
):
    obligation = ObligationService.update_obligation(
        db=db,
        obligation_id=obligation_id,
        obligation_data=obligation_data,
    )

    if obligation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obligation not found",
        )

    return obligation
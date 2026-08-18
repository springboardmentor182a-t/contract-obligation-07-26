from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.auth.dependencies import OBLIGATION_ROLES, require_roles
from src.obligations.schemas import (
    ObligationCreate,
    ObligationResponse,
    ObligationUpdate,
)
from src.obligations.service import ObligationService

router = APIRouter(
    prefix="/obligations",
    tags=["Obligations"],
    dependencies=[Depends(require_roles(*OBLIGATION_ROLES))],
)


@router.get("/", response_model=list[ObligationResponse])
def get_obligations(db: Session = Depends(get_db)):
    return ObligationService.get_all_obligations(db)


@router.post(
    "/",
    response_model=ObligationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_obligation(
    obligation_data: ObligationCreate,
    db: Session = Depends(get_db),
):
    return ObligationService.create_obligation(
        db=db,
        obligation_data=obligation_data,
    )


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
@router.delete(
    "/{obligation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_obligation(
    obligation_id: int,
    db: Session = Depends(get_db),
):
    deleted = ObligationService.delete_obligation(
        db=db,
        obligation_id=obligation_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obligation not found",
        )

    return None

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.entities.enums import ObligationCompletionStatus
from src.obligations import service
from src.obligations.models import (
    ObligationCreateRequest,
    ObligationUpdateRequest,
    ObligationCompletionUpdateRequest,
    ObligationResponse,
)

router = APIRouter(prefix="/api/obligations", tags=["Obligations"])


@router.post("", response_model=ObligationResponse, status_code=201)
def create_obligation(
    payload: ObligationCreateRequest, db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    return service.create_obligation(db, payload)


@router.get("", response_model=list[ObligationResponse])
def list_obligations(
    contract_id: UUID | None = Query(default=None),
    responsible_user_id: UUID | None = Query(default=None),
    completion_status: ObligationCompletionStatus | None = Query(default=None),
    overdue_only: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    return service.list_obligations(
        db, contract_id, responsible_user_id, completion_status, overdue_only, skip, limit
    )


@router.get("/{obligation_id}", response_model=ObligationResponse)
def get_obligation(
    obligation_id: UUID, db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    return service.get_obligation_by_id(db, obligation_id)


@router.patch("/{obligation_id}", response_model=ObligationResponse)
def update_obligation(
    obligation_id: UUID,
    payload: ObligationUpdateRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    return service.update_obligation(db, obligation_id, payload)


@router.patch("/{obligation_id}/completion-status", response_model=ObligationResponse)
def update_completion_status(
    obligation_id: UUID,
    payload: ObligationCompletionUpdateRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    return service.update_completion_status(db, obligation_id, payload.completion_status)

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.database.core import get_db
from src.entities.obligation import ObligationStatus
from src.entities.user import User
from src.obligations.models import ObligationCreateRequest, ObligationUpdateRequest, ObligationResponse
from src.obligations import service

router = APIRouter(prefix="/api/v1/obligations", tags=["Obligations"])


@router.get("", response_model=List[ObligationResponse])
def list_obligations(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[ObligationStatus] = None,
    contract_id: Optional[UUID] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return service.list_obligations(db, skip, limit, status_filter, contract_id, search)


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return service.obligation_stats(db)


@router.get("/{obligation_id}", response_model=ObligationResponse)
def get_obligation(obligation_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return service.get_obligation(db, obligation_id)


@router.post("", response_model=ObligationResponse, status_code=status.HTTP_201_CREATED)
def create_obligation(payload: ObligationCreateRequest, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return service.create_obligation(db, payload)


@router.put("/{obligation_id}", response_model=ObligationResponse)
def update_obligation(
    obligation_id: UUID,
    payload: ObligationUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return service.update_obligation(db, obligation_id, payload)


@router.delete("/{obligation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_obligation(obligation_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    service.delete_obligation(db, obligation_id)
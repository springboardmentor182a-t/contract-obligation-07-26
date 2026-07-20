from datetime import datetime, timedelta
from uuid import UUID
from typing import Optional

from sqlalchemy.orm import Session

from src.entities.obligation import Obligation, ObligationStatus
from src.entities.contract import Contract
from src.entities.user import User
from src.exceptions import NotFoundError
from src.obligations.models import ObligationCreateRequest, ObligationUpdateRequest


def _attach_display_fields(db: Session, obligations):
    """Attach contract_name / owner_name to each obligation for list/detail views."""
    contract_ids = {o.contract_id for o in obligations if o.contract_id}
    owner_ids = {o.owner_id for o in obligations if o.owner_id}

    contracts_by_id = {}
    if contract_ids:
        for c in db.query(Contract).filter(Contract.id.in_(contract_ids)).all():
            contracts_by_id[c.id] = c.name

    owners_by_id = {}
    if owner_ids:
        for u in db.query(User).filter(User.id.in_(owner_ids)).all():
            owners_by_id[u.id] = u.full_name

    for o in obligations:
        o.contract_name = contracts_by_id.get(o.contract_id)
        o.owner_name = owners_by_id.get(o.owner_id)
    return obligations


def list_obligations(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[ObligationStatus] = None,
    contract_id: Optional[UUID] = None,
    search: Optional[str] = None,
):
    query = db.query(Obligation)
    if status_filter:
        query = query.filter(Obligation.status == status_filter)
    if contract_id:
        query = query.filter(Obligation.contract_id == contract_id)
    if search:
        query = query.filter(Obligation.title.ilike(f"%{search}%"))
    obligations = query.order_by(Obligation.due_date.asc()).offset(skip).limit(limit).all()
    return _attach_display_fields(db, obligations)


def get_obligation(db: Session, obligation_id: UUID) -> Obligation:
    obligation = db.query(Obligation).filter(Obligation.id == obligation_id).first()
    if not obligation:
        raise NotFoundError("Obligation not found.")
    return obligation


def create_obligation(db: Session, payload: ObligationCreateRequest) -> Obligation:
    obligation = Obligation(**payload.model_dump())
    db.add(obligation)
    db.commit()
    db.refresh(obligation)
    return obligation


def update_obligation(db: Session, obligation_id: UUID, payload: ObligationUpdateRequest) -> Obligation:
    obligation = get_obligation(db, obligation_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obligation, field, value)
    if payload.status == ObligationStatus.COMPLETED:
        obligation.completed_at = datetime.utcnow()
        obligation.progress_percent = 100
    db.commit()
    db.refresh(obligation)
    return obligation


def delete_obligation(db: Session, obligation_id: UUID) -> None:
    obligation = get_obligation(db, obligation_id)
    db.delete(obligation)
    db.commit()


def obligation_stats(db: Session) -> dict:
    total = db.query(Obligation).count()
    completed = db.query(Obligation).filter(Obligation.status == ObligationStatus.COMPLETED).count()
    in_progress = db.query(Obligation).filter(Obligation.status == ObligationStatus.IN_PROGRESS).count()
    overdue = db.query(Obligation).filter(Obligation.status == ObligationStatus.OVERDUE).count()

    due_soon_cutoff = datetime.utcnow() + timedelta(days=30)
    due_soon = (
        db.query(Obligation)
        .filter(
            Obligation.status.notin_([ObligationStatus.COMPLETED, ObligationStatus.OVERDUE]),
            Obligation.due_date.isnot(None),
            Obligation.due_date <= due_soon_cutoff,
        )
        .count()
    )

    return {
        "total_obligations": total,
        "completed": completed,
        "in_progress": in_progress,
        "due_soon": due_soon,
        "overdue": overdue,
    }
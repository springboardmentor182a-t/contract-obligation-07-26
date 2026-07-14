from datetime import datetime, timezone, date
from uuid import UUID

from sqlalchemy.orm import Session

from src.entities.obligation import Obligation
from src.entities.contract import Contract
from src.entities.enums import ObligationCompletionStatus, ComplianceLevel
from src.obligations.models import ObligationCreateRequest, ObligationUpdateRequest
from src.exceptions import NotFoundError, ValidationError


def create_obligation(db: Session, payload: ObligationCreateRequest) -> Obligation:
    contract = db.query(Contract).filter(Contract.id == payload.contract_id).first()
    if not contract:
        raise NotFoundError("Contract", str(payload.contract_id))

    obligation = Obligation(
        contract_id=payload.contract_id,
        title=payload.title,
        description=payload.description,
        obligation_type=payload.obligation_type,
        due_date=payload.due_date,
        responsible_user_id=payload.responsible_user_id,
        completion_status=ObligationCompletionStatus.PENDING,
        compliance_status=ComplianceLevel.PENDING,
    )
    db.add(obligation)
    db.commit()
    db.refresh(obligation)
    return obligation


def get_obligation_by_id(db: Session, obligation_id: UUID) -> Obligation:
    obligation = db.query(Obligation).filter(Obligation.id == obligation_id).first()
    if not obligation:
        raise NotFoundError("Obligation", str(obligation_id))
    return obligation


def list_obligations(
    db: Session,
    contract_id: UUID | None = None,
    responsible_user_id: UUID | None = None,
    completion_status: ObligationCompletionStatus | None = None,
    overdue_only: bool = False,
    skip: int = 0,
    limit: int = 50,
) -> list[Obligation]:
    query = db.query(Obligation)

    if contract_id is not None:
        query = query.filter(Obligation.contract_id == contract_id)
    if responsible_user_id is not None:
        query = query.filter(Obligation.responsible_user_id == responsible_user_id)
    if completion_status is not None:
        query = query.filter(Obligation.completion_status == completion_status)
    if overdue_only:
        query = query.filter(
            Obligation.due_date < date.today(),
            Obligation.completion_status != ObligationCompletionStatus.COMPLETED,
        )

    return query.order_by(Obligation.due_date.asc()).offset(skip).limit(limit).all()


def update_obligation(db: Session, obligation_id: UUID, payload: ObligationUpdateRequest) -> Obligation:
    obligation = get_obligation_by_id(db, obligation_id)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(obligation, field, value)
    db.commit()
    db.refresh(obligation)
    return obligation


def update_completion_status(
    db: Session, obligation_id: UUID, new_status: ObligationCompletionStatus
) -> Obligation:
    obligation = get_obligation_by_id(db, obligation_id)

    if obligation.completion_status == ObligationCompletionStatus.COMPLETED:
        raise ValidationError("This obligation is already marked completed and cannot be changed.")

    obligation.completion_status = new_status

    # Derive compliance_status from completion + due date -- this is
    # exactly the "Compliance Monitoring" link the doc describes between
    # Obligation Tracking and the Compliance module.
    if new_status == ObligationCompletionStatus.COMPLETED:
        obligation.completed_at = datetime.now(timezone.utc)
        obligation.compliance_status = (
            ComplianceLevel.DELAYED if obligation.due_date < date.today() else ComplianceLevel.COMPLIANT
        )
    elif new_status == ObligationCompletionStatus.OVERDUE:
        obligation.compliance_status = ComplianceLevel.NON_COMPLIANT
    else:
        obligation.compliance_status = ComplianceLevel.PENDING

    db.commit()
    db.refresh(obligation)
    return obligation


def mark_overdue_obligations(db: Session) -> int:
    """
    Missed Obligation Detection (Compliance Monitoring module, Sec. 6).
    Intended to run periodically (e.g. a daily Celery beat task) --
    flips any obligation whose due date has passed and is still
    unresolved to OVERDUE / NON_COMPLIANT. Returns the number updated.
    """
    today = date.today()
    stale = (
        db.query(Obligation)
        .filter(
            Obligation.due_date < today,
            Obligation.completion_status.in_(
                [ObligationCompletionStatus.PENDING, ObligationCompletionStatus.IN_PROGRESS]
            ),
        )
        .all()
    )
    for obligation in stale:
        obligation.completion_status = ObligationCompletionStatus.OVERDUE
        obligation.compliance_status = ComplianceLevel.NON_COMPLIANT

    db.commit()
    return len(stale)

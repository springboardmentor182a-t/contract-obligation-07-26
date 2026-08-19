from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from src.audit.service import create_audit_log
from src.contract_repository.models import Contract
from src.database.models import ObligationModel, User
from src.obligations.schemas import (
    ObligationCreate,
    ObligationResponse,
    ObligationUpdate,
)


class ObligationService:

    @staticmethod
    def _to_response(
        obligation: ObligationModel,
    ) -> ObligationResponse:
        response = ObligationResponse.model_validate(
            obligation
        )

        return response.model_copy(
            update={
                "contract_name": (
                    obligation.contract.contract_name
                    if obligation.contract
                    else None
                ),
                "owner_name": (
                    obligation.owner.full_name
                    if obligation.owner
                    else None
                ),
            }
        )

    @staticmethod
    def get_all_obligations(db: Session):
        obligations = (
            db.query(ObligationModel)
            .options(
                joinedload(ObligationModel.contract),
                joinedload(ObligationModel.owner),
            )
            .all()
        )
        return [
            ObligationService._to_response(obligation)
            for obligation in obligations
        ]

    @staticmethod
    def create_obligation(
        db: Session,
        obligation_data: ObligationCreate,
    ):
        if obligation_data.contract_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A contract is required.",
            )

        contract = (
            db.query(Contract)
            .filter(
                Contract.id == obligation_data.contract_id
            )
            .first()
        )
        if contract is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contract not found.",
            )

        owner = None
        if obligation_data.owner_id is not None:
            owner = (
                db.query(User)
                .filter(
                    User.id == obligation_data.owner_id
                )
                .first()
            )
            if owner is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Obligation owner not found.",
                )

        new_obligation = ObligationModel(
            **obligation_data.model_dump()
        )
        new_obligation.contract = contract
        new_obligation.owner = owner

        try:
            db.add(new_obligation)
            db.commit()
            db.refresh(new_obligation)
        except IntegrityError as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Unable to create obligation because the "
                    "selected contract or owner is invalid."
                ),
            ) from exc
        except SQLAlchemyError as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to create obligation.",
            ) from exc

        create_audit_log(
            db=db,
            user_id=None,
            event_type="CREATE",
            action="Obligation Created",
            module="Obligation Tracker",
            description=(
                f"Created obligation: {new_obligation.title} "
                f"(ID: {new_obligation.id}, "
                f"contract ID: {new_obligation.contract_id})"
            ),
        )

        return ObligationService._to_response(
            new_obligation
        )

    @staticmethod
    def update_obligation(
        db: Session,
        obligation_id: int,
        obligation_data: ObligationUpdate,
    ):
        obligation = (
            db.query(ObligationModel)
            .filter(ObligationModel.id == obligation_id)
            .first()
        )

        if obligation is None:
            return None

        update_data = obligation_data.model_dump(
            exclude_unset=True
        )
        previous_status = obligation.status

        for field, value in update_data.items():
            setattr(obligation, field, value)

        db.commit()
        db.refresh(obligation)

        status_changed = (
            "status" in update_data
            and previous_status != obligation.status
        )
        normalized_status = (
            obligation.status or ""
        ).strip().lower()

        if status_changed and normalized_status == "approved":
            event_type = "APPROVE"
            action = "Obligation Approved"
            description = (
                f"Approved obligation: {obligation.title} "
                f"(ID: {obligation.id}, "
                f"previous status: {previous_status})"
            )
        elif status_changed and normalized_status == "rejected":
            event_type = "REJECT"
            action = "Obligation Rejected"
            description = (
                f"Rejected obligation: {obligation.title} "
                f"(ID: {obligation.id}, "
                f"previous status: {previous_status})"
            )
        elif status_changed:
            event_type = "UPDATE"
            action = "Obligation Status Changed"
            description = (
                f"Changed obligation status: {obligation.title} "
                f"(ID: {obligation.id}) from "
                f"{previous_status} to {obligation.status}"
            )
        else:
            event_type = "UPDATE"
            action = "Obligation Updated"
            description = (
                f"Updated obligation: {obligation.title} "
                f"(ID: {obligation.id})"
            )

        create_audit_log(
            db=db,
            user_id=None,
            event_type=event_type,
            action=action,
            module="Obligation Tracker",
            description=description,
        )

        return ObligationService._to_response(
            obligation
        )

    @staticmethod
    def delete_obligation(
        db: Session,
        obligation_id: int,
    ):
        obligation = (
            db.query(ObligationModel)
            .filter(ObligationModel.id == obligation_id)
            .first()
        )

        if obligation is None:
            return False

        obligation_id = obligation.id
        obligation_title = obligation.title

        db.delete(obligation)
        db.commit()

        create_audit_log(
            db=db,
            user_id=None,
            event_type="DELETE",
            action="Obligation Deleted",
            module="Obligation Tracker",
            description=(
                f"Deleted obligation: {obligation_title} "
                f"(ID: {obligation_id})"
            ),
        )

        return True

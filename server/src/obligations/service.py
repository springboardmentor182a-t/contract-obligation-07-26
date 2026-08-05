from sqlalchemy.orm import Session

from src.audit.service import create_audit_log
from src.database.models import ObligationModel
from src.obligations.schemas import (
    ObligationCreate,
    ObligationUpdate,
)


class ObligationService:

    @staticmethod
    def get_all_obligations(db: Session):
        return db.query(ObligationModel).all()

    @staticmethod
    def create_obligation(
        db: Session,
        obligation_data: ObligationCreate,
    ):
        new_obligation = ObligationModel(
            **obligation_data.model_dump()
        )

        db.add(new_obligation)
        db.commit()
        db.refresh(new_obligation)

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

        return new_obligation

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

        if status_changed:
            action = "Obligation Status Changed"
            description = (
                f"Changed obligation status: {obligation.title} "
                f"(ID: {obligation.id}) from "
                f"{previous_status} to {obligation.status}"
            )
        else:
            action = "Obligation Updated"
            description = (
                f"Updated obligation: {obligation.title} "
                f"(ID: {obligation.id})"
            )

        create_audit_log(
            db=db,
            user_id=None,
            event_type="UPDATE",
            action=action,
            module="Obligation Tracker",
            description=description,
        )

        return obligation

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

from sqlalchemy.orm import Session

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

        for field, value in update_data.items():
            setattr(obligation, field, value)

        db.commit()
        db.refresh(obligation)
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

        db.delete(obligation)
        db.commit()

        return True
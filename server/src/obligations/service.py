from sqlalchemy.orm import Session

from src.database.models import ObligationModel
from src.obligations.schemas import ObligationUpdate


class ObligationService:

    @staticmethod
    def get_all_obligations(db: Session):
        return db.query(ObligationModel).all()

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

        update_data = obligation_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(obligation, field, value)

        db.commit()
        db.refresh(obligation)

        return obligation
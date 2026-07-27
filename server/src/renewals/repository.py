from sqlalchemy import select
from sqlalchemy.orm import Session
from .models import Renewal

class RenewalRepository:

    def get_all(self, db: Session):
        result = db.execute(select(Renewal))
        return result.scalars().all()

    def create(self, db: Session, renewal: Renewal):
        db.add(renewal)
        db.commit()
        db.refresh(renewal)
        return renewal
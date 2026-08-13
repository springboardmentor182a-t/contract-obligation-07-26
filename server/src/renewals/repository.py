from sqlalchemy import select

from .models import Renewal


class RenewalRepository:

    def get_all(self, db):
        result = db.execute(select(Renewal))
        return result.scalars().all()

    def create(self, db, renewal: Renewal):
        db.add(renewal)
        db.commit()
        db.refresh(renewal)
        return renewal
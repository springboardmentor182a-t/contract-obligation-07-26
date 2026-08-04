from src.database.core import SessionLocal
from src.renewals.models import RenewalModel
from src.entities.renewal import Renewal


def get_all_renewals():
    db = SessionLocal()

    try:
        return db.query(RenewalModel).all()
    finally:
        db.close()


def get_renewal_by_id(renewal_id: str):
    db = SessionLocal()

    try:
        return (
            db.query(RenewalModel)
            .filter(RenewalModel.id == renewal_id)
            .first()
        )
    finally:
        db.close()


def create_renewal(renewal: Renewal):
    db = SessionLocal()

    try:
        db_renewal = RenewalModel(**renewal.model_dump())

        db.add(db_renewal)
        db.commit()
        db.refresh(db_renewal)

        return db_renewal

    finally:
        db.close()


def update_renewal(renewal_id: str, updated_renewal: Renewal):
    db = SessionLocal()

    try:
        renewal = (
            db.query(RenewalModel)
            .filter(RenewalModel.id == renewal_id)
            .first()
        )

        if not renewal:
            return None

        data = updated_renewal.model_dump()

        for key, value in data.items():
            setattr(renewal, key, value)

        db.commit()
        db.refresh(renewal)

        return renewal

    finally:
        db.close()


def delete_renewal(renewal_id: str):
    db = SessionLocal()

    try:
        renewal = (
            db.query(RenewalModel)
            .filter(RenewalModel.id == renewal_id)
            .first()
        )

        if not renewal:
            return None

        db.delete(renewal)
        db.commit()

        return {"message": "Renewal deleted successfully"}

    finally:
        db.close()
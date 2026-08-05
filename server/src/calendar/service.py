from src.database.core import SessionLocal
from src.calendar.models import CalendarEventModel
from src.entities.calendar import CalendarEventCreate


def get_all_events():
    db = SessionLocal()

    try:
        return db.query(CalendarEventModel).all()
    finally:
        db.close()


def get_event_by_id(event_id: int):
    db = SessionLocal()

    try:
        return (
            db.query(CalendarEventModel)
            .filter(CalendarEventModel.id == event_id)
            .first()
        )
    finally:
        db.close()


def create_event(event: CalendarEventCreate):
    db = SessionLocal()

    try:
        db_event = CalendarEventModel(**event.model_dump())

        db.add(db_event)
        db.commit()
        db.refresh(db_event)

        return db_event

    finally:
        db.close()


def update_event(event_id: int, updated_event: CalendarEventCreate):
    db = SessionLocal()

    try:
        event = (
            db.query(CalendarEventModel)
            .filter(CalendarEventModel.id == event_id)
            .first()
        )

        if not event:
            return None

        data = updated_event.model_dump()

        for key, value in data.items():
            setattr(event, key, value)

        db.commit()
        db.refresh(event)

        return event

    finally:
        db.close()


def delete_event(event_id: int):
    db = SessionLocal()

    try:
        event = (
            db.query(CalendarEventModel)
            .filter(CalendarEventModel.id == event_id)
            .first()
        )

        if not event:
            return None

        db.delete(event)
        db.commit()

        return {"message": "Event deleted successfully"}

    finally:
        db.close()
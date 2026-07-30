from fastapi import APIRouter, HTTPException
from src.calendar.service import (
    get_all_events,
    get_event_by_id,
    create_event,
    update_event,
    delete_event,
)
from src.entities.calendar import CalendarEvent, CalendarEventCreate

router = APIRouter()


@router.get("/calendar")
def get_events():
    return get_all_events()


@router.get("/calendar/{event_id}")
def get_event(event_id: int):
    event = get_event_by_id(event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event


@router.post("/calendar")
def add_event(event: CalendarEventCreate):
    return create_event(event)


@router.put("/calendar/{event_id}")
def edit_event(event_id: int, event: CalendarEventCreate):
    updated = update_event(event_id, event)

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return updated


@router.delete("/calendar/{event_id}")
def remove_event(event_id: int):
    deleted = delete_event(event_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return deleted
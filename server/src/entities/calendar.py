from datetime import date, time, datetime
from pydantic import BaseModel


class CalendarEventCreate(BaseModel):
    title: str
    description: str
    event_type: str

    start_date: date
    end_date: date

    start_time: time
    end_time: time

    location: str
    owner: str

    priority: str
    status: str
    color: str


class CalendarEvent(CalendarEventCreate):
    id: int
    created_at: datetime
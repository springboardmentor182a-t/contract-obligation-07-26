from sqlalchemy import Column, Integer, String, Text, Date, Time, DateTime
from src.database.core import Base


class CalendarEventModel(Base):
    __tablename__ = "calendar_events"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    description = Column(Text)

    event_type = Column(String(50))

    start_date = Column(Date)
    end_date = Column(Date)

    start_time = Column(Time)
    end_time = Column(Time)

    location = Column(String(255))
    owner = Column(String(100))

    priority = Column(String(20))
    status = Column(String(20))
    color = Column(String(20))

    created_at = Column(DateTime)
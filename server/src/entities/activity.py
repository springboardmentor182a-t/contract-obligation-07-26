from sqlalchemy import Column, Integer, String
from src.database.core import Base


class Activity(Base):

    __tablename__ = "activities"

    id = Column(Integer, primary_key=True)

    activity = Column(String(255))

    username = Column(String(100))
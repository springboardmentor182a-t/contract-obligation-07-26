from sqlalchemy import Column, Integer, String, ForeignKey
from src.database.core import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    message = Column(String(255))

    status = Column(String(50))
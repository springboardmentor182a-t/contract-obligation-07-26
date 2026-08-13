<<<<<<< HEAD
from sqlalchemy import Column, Integer, String
from src.database.core import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True)
    password = Column(String(255))
    role = Column(String(50))
=======
from src.database.models import User as UserEntity

>>>>>>> origin/main-group-D

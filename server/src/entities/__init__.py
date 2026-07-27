from .user import UserEntity
from .todo import TodoEntity
from ..database.core import Base, engine

# Base.metadata.create_all(bind=engine)
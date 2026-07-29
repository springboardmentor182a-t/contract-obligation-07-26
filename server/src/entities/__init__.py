<<<<<<< HEAD
from src.entities.contract import Contract
from src.entities.document import Document
=======
from .user import UserEntity
from .todo import TodoEntity
from ..database.core import Base, engine

# This creates the tables in the database when the app starts
Base.metadata.create_all(bind=engine)
>>>>>>> origin/main-group-D

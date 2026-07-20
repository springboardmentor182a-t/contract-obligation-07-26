from .user import User
from .contract import Contract
from .document import Document

from src.database.core import Base, engine

# Create all database tables
Base.metadata.create_all(bind=engine)
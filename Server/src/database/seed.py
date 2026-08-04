import sys
import os

# Add the server's root directory to python path if run directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.database.core import SessionLocal, engine
from src.database.core import Base


def seed_db():
    """Initialize database schema without inserting any dummy data."""
    print("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    print("Database schema initialized successfully. No seed data inserted.")


if __name__ == "__main__":
    seed_db()

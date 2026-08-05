"""Database session and connection pool setup. Hidden from domain entities."""

from src.database.db import get_db

__all__ = ["get_db"]
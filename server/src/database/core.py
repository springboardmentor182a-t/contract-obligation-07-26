import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


SERVER_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = SERVER_DIR / ".env"

# Local development lo server/.env unte load chestundi.
# GitHub Actions lo workflow environment variables use avutayi.
if ENV_FILE.exists():
    load_dotenv(ENV_FILE, override=False)

Base = declarative_base()

engine = None
SessionLocal = None


def initialize_database():
    """Create the database engine and session factory when required."""
    global engine, SessionLocal

    if engine is not None:
        return

    database_url = os.getenv("DATABASE_URL")

    if not database_url or database_url.startswith("postgresql://user:password@localhost"):
        fallback = SERVER_DIR / "dev.db"
        database_url = f"sqlite:///{fallback}"

    try:
        engine = create_engine(
            database_url,
            pool_pre_ping=True,
        )
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        print("WARNING: Primary DB connection failed, falling back to local SQLite dev.db:", exc)
        fallback = SERVER_DIR / "dev.db"
        database_url = f"sqlite:///{fallback}"
        engine = create_engine(
            database_url,
            pool_pre_ping=True,
        )
        Base.metadata.create_all(bind=engine)

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )


def get_db():
    """Provide a database session for FastAPI dependencies."""
    initialize_database()

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
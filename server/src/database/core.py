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

    # If DATABASE_URL isn't provided in dev, fall back to a local SQLite file
    # so the app can run without external DB configuration.
    if not database_url or not database_url.strip():
        fallback = SERVER_DIR / "dev.db"
        database_url = f"sqlite:///{fallback}"
        print("WARNING: DATABASE_URL not set — falling back to local SQLite:", database_url)
    elif database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql://")
    elif database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://")

    connect_args = {}
    if database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        connect_args=connect_args,
    )


    # Create missing tables automatically (convenience for local development).
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        print("ERROR creating database tables:", exc)

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
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SERVER_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = SERVER_DIR / ".env"

# Load .env for local development only
if ENV_FILE.exists():
    load_dotenv(ENV_FILE, override=False)

Base = declarative_base()

engine = None
SessionLocal = None


def initialize_database():
    """Initialize the database engine and session factory."""

    global engine, SessionLocal

    # Already initialized
    if SessionLocal is not None:
        return

    database_url = os.getenv("DATABASE_URL")

    print("Database configuration loaded.")

    # Local SQLite fallback
    if not database_url or not database_url.strip():
        fallback = SERVER_DIR / "dev.db"
        database_url = f"sqlite:///{fallback}"
        print(
            "WARNING: DATABASE_URL not found. Falling back to SQLite:",
            database_url,
        )

    # Normalize PostgreSQL URLs
    elif database_url.startswith("postgres://"):
        database_url = database_url.replace(
            "postgres://",
            "postgresql://",
            1,
        )

    elif database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace(
            "postgresql+asyncpg://",
            "postgresql://",
            1,
        )

    connect_args = {}

    if database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    elif database_url.startswith("postgresql"):
        connect_args = {"connect_timeout": 3}

    # Create engine
    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        connect_args=connect_args,
    )

    # Create session factory
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    # Ensure all models are registered
    try:
        import src.database.models
        import src.contract_repository.models
        import src.renewals.models
    except Exception as e:
        print("Warning importing models:", e)

    # SQLite doesn't support schemas
    if database_url.startswith("sqlite"):
        for table in list(Base.metadata.tables.values()):
            table.schema = None

    # Create tables (with fallback to SQLite if PostgreSQL fails to connect)
    try:
        Base.metadata.create_all(bind=engine)
        print("Database initialized successfully.")
    except Exception as exc:
        print("Error connecting to primary database:", exc)
        if not database_url.startswith("sqlite"):
            print("Falling back to local SQLite database...")
            fallback = SERVER_DIR / "dev.db"
            database_url = f"sqlite:///{fallback}"
            connect_args = {"check_same_thread": False}
            engine = create_engine(database_url, connect_args=connect_args)
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            for table in list(Base.metadata.tables.values()):
                table.schema = None
            Base.metadata.create_all(bind=engine)
            print("Fallback SQLite database initialized successfully.")
        else:
            raise


def get_db():
    """FastAPI dependency for database session."""

    initialize_database()

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

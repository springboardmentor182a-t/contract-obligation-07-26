from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from src.core.config import settings

print(repr(settings.DATABASE_URL))


def _get_engine():
    try:
        connect_args = {}
        if "sqlite" in settings.DATABASE_URL:
            connect_args = {"check_same_thread": False}
        
        eng = create_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            pool_pre_ping=True,
            connect_args=connect_args,
        )
        with eng.connect() as conn:
            pass
        return eng
    except Exception as e:
        print(f"\n[DATABASE WARNING] Could not connect to primary DATABASE_URL ({settings.DATABASE_URL}): {e}")
        print("[DATABASE FALLBACK] Switched to local SQLite database (sqlite:///./sql_app.db)\n")
        return create_engine(
            "sqlite:///./sql_app.db",
            echo=settings.DEBUG,
            connect_args={"check_same_thread": False},
        )


engine = _get_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from sqlalchemy import text

def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        
        # Ensure missing notification columns exist across PostgreSQL and SQLite
        notification_queries = [
            "ALTER TABLE notifications ADD COLUMN priority VARCHAR(50);",
            "ALTER TABLE notifications ADD COLUMN priority_score INTEGER;",
            "ALTER TABLE notifications ADD COLUMN priority_reason VARCHAR(1000);"
        ]
        for q in notification_queries:
            try:
                with engine.connect() as conn:
                    conn.execute(text(q))
                    conn.commit()
            except Exception:
                pass
    except Exception as e:
        print(f"Error creating tables: {e}")
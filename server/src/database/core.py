from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

SQLALCHEMY_DATABASE_URL = os.getenv(
<<<<<<< HEAD
    "DATABASE_URL", 
    "postgresql://postgres:adin123@localhost:5432/contractiq"
=======
    "DATABASE_URL",
    "postgresql://postgres:admin123@localhost:5432/contractiq"
>>>>>>> origin/main-group-D
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
<<<<<<< HEAD
        db.close()
=======
        db.close()
>>>>>>> origin/main-group-D

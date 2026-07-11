# server/src/database/core.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Replace 'postgres', 'password', and 'contractiq' with your actual PostgreSQL credentials and database name
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost:5432/contractiq"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
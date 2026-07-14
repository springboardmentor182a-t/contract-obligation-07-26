# server/src/database/core.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Make sure 'postgres', 'password', and 'contractiq' match your actual local database setup
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:admin123@localhost:5432/contractiq"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
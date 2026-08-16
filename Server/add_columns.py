import os
from sqlalchemy import MetaData, Table
from src.database.core import engine

def show_columns():
    metadata = MetaData()
    obligations = Table('obligations', metadata, autoload_with=engine)
    print("Columns in obligations table:", [c.name for c in obligations.columns])

if __name__ == "__main__":
    show_columns()

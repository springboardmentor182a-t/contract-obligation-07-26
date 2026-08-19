import os
from sqlalchemy import text
from src.database.core import engine

def add_columns():
    queries = [
        "ALTER TABLE notifications ADD COLUMN priority VARCHAR(50);",
        "ALTER TABLE notifications ADD COLUMN priority_score INTEGER;",
        "ALTER TABLE notifications ADD COLUMN priority_reason VARCHAR(1000);"
    ]
    
    for q in queries:
        try:
            with engine.connect() as conn:
                conn.execute(text(q))
                conn.commit()
                print(f"Executed: {q}")
        except Exception as e:
            print(f"Failed {q}: {e}")

if __name__ == "__main__":
    add_columns()

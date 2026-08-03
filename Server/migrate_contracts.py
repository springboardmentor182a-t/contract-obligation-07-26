"""Add missing columns to the contracts table."""
from src.database.core import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text(
        "ALTER TABLE contracts "
        "ADD COLUMN IF NOT EXISTS effective_date DATE, "
        "ADD COLUMN IF NOT EXISTS expiry_date DATE, "
        "ADD COLUMN IF NOT EXISTS approved_date TIMESTAMPTZ, "
        "ADD COLUMN IF NOT EXISTS review_date TIMESTAMPTZ, "
        "ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;"
    ))
    conn.commit()
    print("All missing columns added successfully!")

import os
import psycopg2

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/contractiq"
)

def get_connection():
    return psycopg2.connect(DATABASE_URL)
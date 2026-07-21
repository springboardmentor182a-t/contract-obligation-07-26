import psycopg2
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres123@localhost:5432/contractsiq"
)

connection = psycopg2.connect(DATABASE_URL)
connection.autocommit = True

def get_db():
    return connection
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

try:
    conn = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="root",
        host="localhost",
        port="5432"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'contractiq'")
    exists = cursor.fetchone()
    if not exists:
        cursor.execute("CREATE DATABASE contractiq")
        print("CREATED")
    else:
        print("EXISTS")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")

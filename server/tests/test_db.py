

from src.database.core import get_connection

try:
    conn = get_connection()
    print("PostgreSQL Connected Successfully")
    conn.close()
except Exception as e:
    print("Connection Failed")
    print(e)
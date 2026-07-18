from src.database.core import get_connection

def test_database_connection():
    conn = get_connection()
    assert conn is not None
    conn.close()
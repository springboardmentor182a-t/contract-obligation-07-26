#from src.database.connection import get_connection
from .models import UserCreate, UserResponse


def create_user(user_data: UserCreate) -> UserResponse:
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO users (email, name, is_active)
        VALUES (%s, %s, %s)
        RETURNING id, email, name, is_active;
        """,
        (user_data.email, user_data.name, True),
    )

    row = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    return UserResponse(
        id=row[0],
        email=row[1],
        name=row[2],
        is_active=row[3],
    )


def get_user_by_id(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, email, name, is_active
        FROM users
        WHERE id = %s;
        """,
        (user_id,),
    )

    row = cur.fetchone()

    cur.close()
    conn.close()

    if row:
        return UserResponse(
            id=row[0],
            email=row[1],
            name=row[2],
            is_active=row[3],
        )

    return None
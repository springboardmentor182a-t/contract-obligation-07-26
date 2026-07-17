from src.database.core import get_connection


def get_all_renewals():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            r.id,
            c.contract_name,
            c.client_name,
            r.renewal_date,
            r.reminder_days,
            r.status,
            r.renewal_type
        FROM renewals r
        JOIN contracts c
        ON r.contract_id = c.id
        ORDER BY r.renewal_date;
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    renewals = []

    for row in rows:
        renewals.append({
            "id": row[0],
            "contract_name": row[1],
            "client_name": row[2],
            "renewal_date": row[3],
            "reminder_days": row[4],
            "status": row[5],
            "renewal_type": row[6]
        })

    return renewals
def update_renewal(id: int, renewal: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE renewals
        SET
            renewal_type = %s,
            renewal_date = %s,
            reminder_days = %s,
            status = %s
        WHERE id = %s
        RETURNING id,
                  contract_id,
                  renewal_date,
                  reminder_days,
                  status,
                  renewal_type;
    """, (
        renewal["renewal_type"],
        renewal["renewal_date"],
        renewal["reminder_days"],
        renewal["status"],
        id
    ))

    row = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()

    if not row:
        return {"message": "Renewal not found"}

    return {
        "id": row[0],
        "contract_id": row[1],
        "renewal_date": row[2],
        "reminder_days": row[3],
        "status": row[4],
        "renewal_type": row[5]
    }
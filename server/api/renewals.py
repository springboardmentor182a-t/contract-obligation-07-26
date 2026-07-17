from fastapi import APIRouter, HTTPException
from src.database.core import get_connection

router = APIRouter()


# GET ALL RENEWALS
@router.get("/")
def get_renewals():

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                renewals.id,
                contracts.contract_name,
                contracts.client_name,
                renewals.renewal_type,
                renewals.renewal_date,
                renewals.reminder_days,
                renewals.status

            FROM renewals

            JOIN contracts
            ON renewals.contract_id = contracts.id

            ORDER BY renewals.id ASC
        """)

        rows = cur.fetchall()

        renewals = []

        for row in rows:

            renewals.append({

                "id": row[0],
                "contract_name": row[1],
                "client_name": row[2],
                "renewal_type": row[3],
                "renewal_date": row[4],
                "reminder_days": row[5],
                "status": row[6]

            })

        return renewals

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()
        # ADD NEW RENEWAL
@router.post("/")
def add_renewal(renewal: dict):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            INSERT INTO renewals
            (
                contract_id,
                renewal_type,
                renewal_date,
                reminder_days,
                status
            )

            VALUES (%s, %s, %s, %s, %s)

            RETURNING *
            """,
            (
                renewal["contract_id"],
                renewal["renewal_type"],
                renewal["renewal_date"],
                renewal["reminder_days"],
                renewal["status"],
            )
        )

        conn.commit()

        row = cur.fetchone()

        return {
            "id": row[0],
            "contract_id": row[1],
            "renewal_date": row[2],
            "reminder_days": row[3],
            "status": row[4],
            "renewal_type": row[5]
        }

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()
        # UPDATE RENEWAL
@router.put("/{id}")
def update_renewal(id: int, renewal: dict):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            UPDATE renewals
            SET
                renewal_type = %s,
                renewal_date = %s,
                reminder_days = %s,
                status = %s
            WHERE id = %s
            RETURNING *
            """,
            (
                renewal["renewal_type"],
                renewal["renewal_date"],
                renewal["reminder_days"],
                renewal["status"],
                id
            )
        )

        conn.commit()

        row = cur.fetchone()

        if row is None:
            raise HTTPException(
                status_code=404,
                detail="Renewal not found"
            )

        return {
            "id": row[0],
            "contract_id": row[1],
            "renewal_date": row[2],
            "reminder_days": row[3],
            "status": row[4],
            "renewal_type": row[5]
        }

    except HTTPException:
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()
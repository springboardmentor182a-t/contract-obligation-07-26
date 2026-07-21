'''from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/renewals",
    tags=["renewals"]
)

renewals = [
    
]


@router.get("/")
def get_renewals():
    return renewals


@router.get("/{renewal_id}")
def get_renewal(renewal_id: int):
    for renewal in renewals:
        if renewal["id"] == renewal_id:
            return renewal
    raise HTTPException(status_code=404, detail="Renewal not found")


@router.post("/")
def add_renewal(renewal: dict):
    renewal["id"] = len(renewals) + 1
    renewals.append(renewal)
    return {
        "message": "Renewal added successfully",
        "data": renewal
    }


@router.put("/{renewal_id}")
def update_renewal(renewal_id: int, updated: dict):
    for index, renewal in enumerate(renewals):
        if renewal["id"] == renewal_id:
            updated["id"] = renewal_id
            renewals[index] = updated
            return {
                "message": "Renewal updated successfully",
                "data": updated
            }

    raise HTTPException(status_code=404, detail="Renewal not found")


@router.delete("/{renewal_id}")
def delete_renewal(renewal_id: int):
    for renewal in renewals:
        if renewal["id"] == renewal_id:
            renewals.remove(renewal)
            return {
                "message": "Renewal deleted successfully"
            }

    raise HTTPException(status_code=404, detail="Renewal not found")'''
from fastapi import APIRouter, HTTPException
from src.database.core import get_db

router = APIRouter(
    prefix="/renewals",
    tags=["renewals"]
)


@router.get("/")
def get_renewals():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, contract, client,
               renewal_date,
               renewal_type,
               status
        FROM renewals
        ORDER BY id;
    """)

    rows = cur.fetchall()

    data = []

    for row in rows:
        data.append({
            "id": row[0],
            "contract": row[1],
            "client": row[2],
            "renewal_date": str(row[3]),
            "renewal_type": row[4],
            "status": row[5]
        })

    cur.close()

    return data


@router.get("/{renewal_id}")
def get_renewal(renewal_id: int):

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, contract, client,
               renewal_date,
               renewal_type,
               status
        FROM renewals
        WHERE id=%s
    """, (renewal_id,))

    row = cur.fetchone()

    cur.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Renewal not found")

    return {
        "id": row[0],
        "contract": row[1],
        "client": row[2],
        "renewal_date": str(row[3]),
        "renewal_type": row[4],
        "status": row[5]
    }


'''@router.post("/")
def add_renewal(renewal: dict):
    print(renewal)
    conn = get_db()
    cur = conn.cursor()'''
@router.post("/")
def add_renewal(renewal: dict):
    print("Received:", renewal)
    return {"message": "ok"}

    ...
    cur.execute("""
        INSERT INTO renewals
        (contract, client, renewal_date, renewal_type, status)
        VALUES (%s,%s,%s,%s,%s)
        RETURNING id
    """, (
        renewal["contract"],
        renewal["client"],
        renewal["renewal_date"],
        renewal["renewal_type"],
        renewal["status"]
    ))

    renewal_id = cur.fetchone()[0]

    cur.close()

    return {
        "message": "Renewal added successfully",
        "id": renewal_id
    }


'''@router.put("/{renewal_id}")
def update_renewal(renewal_id: int, renewal: dict):

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        UPDATE renewals
        SET contract=%s,
            client=%s,
            renewal_date=%s,
            renewal_type=%s,
            status=%s
        WHERE id=%s
    """, (
        renewal["contract"],
        renewal["client"],
        renewal["renewal_date"],
        renewal["renewal_type"],
        renewal["status"],
        renewal_id
    ))

    cur.close()

    return {
        "message": "Renewal updated successfully"
    }'''


@router.post("/")
def add_renewal(renewal: dict):

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO renewals
        (contract, client, renewal_date, renewal_type, status)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """, (
        renewal["contract"],
        renewal["client"],
        renewal["renewal_date"],
        renewal["renewal_type"],
        renewal["status"]
    ))

    renewal_id = cur.fetchone()[0]

    conn.commit()
    cur.close()

    return {
        "message": "Renewal added successfully",
        "id": renewal_id
    }




@router.delete("/{renewal_id}")
def delete_renewal(renewal_id: int):

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM renewals WHERE id=%s",
        (renewal_id,)
    )

    cur.close()

    return {
        "message": "Renewal deleted successfully"
    }
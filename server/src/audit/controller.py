from fastapi import APIRouter, Depends, Response
from typing import Optional
from sqlalchemy.orm import Session

from src.database.core import get_db

router = APIRouter(prefix="/audit-logs", tags=["Audit"])


@router.get("")
def list_audit_logs(
    event_type: Optional[str] = None,
    module: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Return audit logs.

    Currently a placeholder returning an empty list so the frontend
    doesn't receive 404. Later this can be implemented to query a
    persistent audit table or external audit service.
    """
    return []


@router.get("/export")
def export_audit_logs(
    event_type: Optional[str] = None,
    module: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # Minimal CSV export placeholder
    csv_content = "id,user,action,module,timestamp\n"
    # No rows for now
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=audit-logs.csv"},
    )

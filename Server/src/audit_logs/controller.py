from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from database.core import get_db
from entities.audit_logs import AuditLog
from entities.user import User
from users.service import admin_required
from audit_logs.service import (
    ensure_audit_schema,
    export_logs,
    query_logs,
    seed_audit_data,
    serialize_log,
    summary,
)

router = APIRouter(prefix="/audit_logs", tags=["Audit Logs"])


def prepared_db(db):
    ensure_audit_schema(db)
    seed_audit_data(db)
    return db


@router.get("/summary")
def get_summary(
    current_user: User = Depends(admin_required), db: Session = Depends(get_db)
):
    return summary(prepared_db(db))


@router.get("")
def get_admin_audit_logs(
    search: Optional[str] = None,
    category: Optional[str] = None,
    entity_type: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return [
        serialize_log(log)
        for log in query_logs(
            prepared_db(db), search, category, entity_type, status, start_date, end_date
        ).all()
    ]


@router.get("/export/report")
def export_audit_report(
    report_format: str = Query("csv", pattern="^(csv|pdf)$"),
    search: Optional[str] = None,
    category: Optional[str] = None,
    entity_type: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    content, media_type, filename = export_logs(
        query_logs(
            prepared_db(db), search, category, entity_type, status, start_date, end_date
        ).all(),
        report_format,
    )
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{audit_id}")
def get_audit_log(
    audit_id: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    log = prepared_db(db).query(AuditLog).filter_by(audit_id=audit_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return serialize_log(log)

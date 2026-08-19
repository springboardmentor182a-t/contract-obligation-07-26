from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Body
from fastapi.responses import Response
from sqlalchemy.orm import Session

try:
    from database.core import get_db
    from entities.audit_logs import AuditLog
    from entities.audit_logs import AuditLog
    from entities.user import User
    from users.service import admin_required, get_current_user
    from audit_logs.service import (
        create_audit_log,
        ensure_audit_schema,
        export_logs,
        get_audit_analytics,
        get_entity_history,
        query_activities,
        query_logs,
        seed_audit_data,
        serialize_activity,
        serialize_log,
        summary,
    )
except ImportError:
    from src.database.core import get_db
    from src.entities.audit_logs import AuditLog
    from src.entities.user import User
    from src.users.service import admin_required, get_current_user
    from src.audit_logs.service import (
        create_audit_log,
        ensure_audit_schema,
        export_logs,
        get_audit_analytics,
        get_entity_history,
        query_activities,
        query_logs,
        seed_audit_data,
        serialize_activity,
        serialize_log,
        summary,
    )

router = APIRouter(prefix="/audit_logs", tags=["Audit Logs"])


def prepared_db(db: Session):
    ensure_audit_schema(db)
    seed_audit_data(db)
    return db


@router.get("/summary")
def get_summary(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return summary(prepared_db(db))


@router.get("/analytics")
def get_analytics(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return get_audit_analytics(prepared_db(db))


@router.get("/entity/{entity_type}/{entity_id}")
def get_entity_audit_trail(
    entity_type: str,
    entity_id: str,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    logs = get_entity_history(prepared_db(db), entity_type, entity_id)
    return [serialize_log(log) for log in logs]


@router.get("/activities")
def get_activities(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return [
        serialize_activity(activity)
        for activity in query_activities(prepared_db(db), limit)
    ]


@router.get("")
def get_admin_audit_logs(
    search: Optional[str] = None,
    category: Optional[str] = None,
    module: Optional[str] = None,
    severity: Optional[str] = None,
    entity_type: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    logs = query_logs(
        prepared_db(db),
        search=search,
        category=category,
        module=module,
        severity=severity,
        entity_type=entity_type,
        status=status,
        start_date=start_date,
        end_date=end_date,
    ).all()
    return [serialize_log(log) for log in logs]


@router.post("")
def record_audit_event(
    payload: dict = Body(...),
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    log = create_audit_log(
        db=prepared_db(db),
        user_id=current_user.user_id if current_user else None,
        user_name=payload.get("user_name") or (current_user.full_name if current_user else "System"),
        action=payload.get("action", "activity"),
        status=payload.get("status", "Success"),
        module=payload.get("module", "System"),
        description=payload.get("description", ""),
        resource=payload.get("resource"),
        ip_address=payload.get("ip_address", "127.0.0.1"),
        entity_type=payload.get("entity_type"),
        entity_id=payload.get("entity_id"),
        category=payload.get("category", "Activity"),
        severity=payload.get("severity", "Info"),
        old_value=payload.get("old_value"),
        new_value=payload.get("new_value"),
    )
    if not log:
        raise HTTPException(status_code=500, detail="Failed to log audit event")
    return serialize_log(log)


@router.get("/export/report")
def export_audit_report(
    report_format: str = Query("csv", pattern="^(csv|pdf)$"),
    search: Optional[str] = None,
    category: Optional[str] = None,
    module: Optional[str] = None,
    severity: Optional[str] = None,
    entity_type: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    logs = query_logs(
        prepared_db(db),
        search=search,
        category=category,
        module=module,
        severity=severity,
        entity_type=entity_type,
        status=status,
        start_date=start_date,
        end_date=end_date,
    ).all()
    content, media_type, filename = export_logs(logs, report_format)
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

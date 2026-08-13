import csv
import io
from datetime import date, datetime, time, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from src.audit.service import create_audit_log
from src.auth.dependencies import AUDIT_ROLES, require_roles
from src.database.core import get_db
from src.database.models import AuditLogModel, UserModel


router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit"],
    dependencies=[Depends(require_roles(*AUDIT_ROLES))],
)


def apply_audit_filters(
    query,
    event_type: Optional[str],
    module: Optional[str],
    start_date: Optional[str],
    end_date: Optional[str],
):
    if event_type:
        query = query.filter(
            AuditLogModel.event_type.ilike(event_type.strip())
        )

    if module:
        query = query.filter(
            AuditLogModel.module.ilike(f"%{module.strip()}%")
        )

    if start_date:
        try:
            parsed_start_date = date.fromisoformat(start_date)
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail="start_date must be in YYYY-MM-DD format.",
            ) from exc

        start_datetime = datetime.combine(
            parsed_start_date,
            time.min,
        )

        query = query.filter(
            AuditLogModel.created_at >= start_datetime
        )

    if end_date:
        try:
            parsed_end_date = date.fromisoformat(end_date)
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail="end_date must be in YYYY-MM-DD format.",
            ) from exc

        # Include the complete end date.
        end_datetime = datetime.combine(
            parsed_end_date + timedelta(days=1),
            time.min,
        )

        query = query.filter(
            AuditLogModel.created_at < end_datetime
        )

    return query


def get_user_name(db: Session, user_id: Optional[int]) -> str:
    if not user_id:
        return "System"

    user = (
        db.query(UserModel)
        .filter(UserModel.id == user_id)
        .first()
    )

    if not user:
        return "System"

    return (
        getattr(user, "full_name", None)
        or getattr(user, "name", None)
        or getattr(user, "email", None)
        or "System"
    )


@router.get("")
def list_audit_logs(
    event_type: Optional[str] = None,
    module: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(AuditLogModel)

    query = apply_audit_filters(
        query=query,
        event_type=event_type,
        module=module,
        start_date=start_date,
        end_date=end_date,
    )

    logs = (
        query
        .order_by(AuditLogModel.created_at.desc())
        .all()
    )

    result = []

    for log in logs:
        user_name = get_user_name(db, log.user_id)

        result.append(
            {
                "id": log.id,
                "user_id": log.user_id,
                "user_name": user_name,
                "event_type": log.event_type,
                "action": log.action,
                "module": log.module,
                "description": log.description,
                "ip_address": log.ip_address,
                "created_at": log.created_at,
            }
        )

    return result


@router.get("/export")
def export_audit_logs(
    event_type: Optional[str] = None,
    module: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(AuditLogModel)

    query = apply_audit_filters(
        query=query,
        event_type=event_type,
        module=module,
        start_date=start_date,
        end_date=end_date,
    )

    logs = (
        query
        .order_by(AuditLogModel.created_at.desc())
        .all()
    )

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow(
        [
            "id",
            "user_id",
            "user_name",
            "event_type",
            "action",
            "module",
            "description",
            "ip_address",
            "created_at",
        ]
    )

    for log in logs:
        user_name = get_user_name(db, log.user_id)

        writer.writerow(
            [
                log.id,
                log.user_id or "",
                user_name,
                log.event_type,
                log.action,
                log.module,
                log.description or "",
                log.ip_address or "",
                log.created_at.isoformat()
                if log.created_at
                else "",
            ]
        )

    csv_content = output.getvalue()
    output.close()

    applied_filters = []
    if event_type:
        applied_filters.append(f"event type: {event_type}")
    if module:
        applied_filters.append(f"module: {module}")
    if start_date:
        applied_filters.append(f"start date: {start_date}")
    if end_date:
        applied_filters.append(f"end date: {end_date}")

    filter_description = (
        ", ".join(applied_filters)
        if applied_filters
        else "none"
    )
    create_audit_log(
        db=db,
        user_id=None,
        event_type="EXPORT",
        action="Audit Logs Exported",
        module="Audit Logs",
        description=(
            f"Exported {len(logs)} audit log records as CSV "
            f"(filters: {filter_description})"
        ),
    )

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition":
                'attachment; filename="audit-logs.csv"'
        },
    )

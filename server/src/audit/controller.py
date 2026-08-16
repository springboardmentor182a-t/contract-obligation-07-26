import csv
import io
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import or_
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.database.models import AuditLog

router = APIRouter()

VALID_CATEGORIES = ["Contract", "Obligation", "User", "Approval", "Security", "Auth"]


def _apply_filters(query, search: Optional[str], categories: Optional[List[str]]):
    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                AuditLog.actor.ilike(like),
                AuditLog.action.ilike(like),
                AuditLog.target.ilike(like),
            )
        )
    if categories:
        query = query.filter(AuditLog.category.in_(categories))
    return query


def _serialize(log: AuditLog):
    return {
        "id": log.id,
        "actor": log.actor,
        "action": log.action,
        "target": log.target,
        "category": log.category,
        "ip": log.ip_address,
        "timestamp": log.timestamp.isoformat() if log.timestamp else None,
    }


@router.get("/")
def get_audit_logs(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None, description="Comma-separated list of categories"),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    db: Session = Depends(get_db),
):
    categories = [c.strip() for c in category.split(",")] if category else None

    query = db.query(AuditLog)
    query = _apply_filters(query, search, categories)
    query = query.order_by(AuditLog.timestamp.desc())

    total = query.count()
    logs = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "logs": [_serialize(l) for l in logs],
        "total": total,
        "page": page,
        "page_size": page_size,
        "has_more": page * page_size < total,
    }


@router.get("/categories")
def get_categories():
    return VALID_CATEGORIES


@router.get("/export")
def export_audit_logs(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    categories = [c.strip() for c in category.split(",")] if category else None

    query = db.query(AuditLog)
    query = _apply_filters(query, search, categories)
    query = query.order_by(AuditLog.timestamp.desc())
    logs = query.all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Timestamp", "Actor", "Action", "Target", "Category", "IP Address"])
    for log in logs:
        writer.writerow([
            log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else "",
            log.actor,
            log.action,
            log.target,
            log.category,
            log.ip_address,
        ])
    buffer.seek(0)

    filename = f"audit-logs-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}.csv"
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

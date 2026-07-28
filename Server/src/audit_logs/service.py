import csv
import io
import json
from datetime import datetime, timedelta

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy import inspect, or_, text
from sqlalchemy.orm import Session

from entities.audit_logs import Activity, AuditLog

def create_audit_log(
    db: Session,
    user_id: int,
    user_name: str,
    action: str,
    status: str,
    module: str,
    description: str,
):
    log = AuditLog(
        user_id=user_id,
        user_name=user_name,
        action=action,
        status=status,
        module=module,
        description=description,
    )

    db.add(log)
    db.commit()


def ensure_audit_schema(db: Session):
    """Additive upgrade for databases created before the enriched audit model."""
    inspector = inspect(db.bind)
    if "audit_logs" not in inspector.get_table_names():
        AuditLog.__table__.create(db.bind, checkfirst=True)
    existing = {column["name"] for column in inspect(db.bind).get_columns("audit_logs")}
    additions = {
        "entity_type": "VARCHAR(100)", "entity_id": "VARCHAR(100)",
        "category": "VARCHAR(50) DEFAULT 'Activity'", "severity": "VARCHAR(50) DEFAULT 'Info'",
        "old_value": "TEXT", "new_value": "TEXT",
    }
    for name, definition in additions.items():
        if name not in existing:
            db.execute(text(f"ALTER TABLE audit_logs ADD COLUMN {name} {definition}"))
    Activity.__table__.create(db.bind, checkfirst=True)
    db.commit()


def create_audit_log(db: Session, user_id=None, user_name="System", action="viewed", status="Success",
                     module="System", description="", resource=None, ip_address=None, entity_type=None,
                     entity_id=None, category="Activity", severity="Info", old_value=None, new_value=None):
    """Record the detailed audit trail and its lightweight activity-feed counterpart."""
    ensure_audit_schema(db)
    log = AuditLog(
        user_id=user_id, user_name=user_name or "System", action=action, status=status,
        module=module, description=description, resource=resource, ip_address=ip_address,
        entity_type=entity_type or module, entity_id=str(entity_id) if entity_id is not None else None,
        category=category, severity=severity,
        old_value=json.dumps(old_value) if isinstance(old_value, (dict, list)) else old_value,
        new_value=json.dumps(new_value) if isinstance(new_value, (dict, list)) else new_value,
    )
    db.add(log)
    db.add(Activity(user_id=user_id, user_name=user_name or "System", action=action,
                    description=description, entity_type=entity_type or module,
                    entity_id=str(entity_id) if entity_id is not None else None))
    db.commit()
    db.refresh(log)
    return log


def query_logs(db: Session, search=None, category=None, entity_type=None, status=None, start_date=None, end_date=None):
    query = db.query(AuditLog)
    if search:
        term = f"%{search}%"
        query = query.filter(or_(AuditLog.user_name.ilike(term), AuditLog.action.ilike(term),
                                 AuditLog.description.ilike(term), AuditLog.entity_id.ilike(term)))
    if category and category != "All":
        query = query.filter(AuditLog.category == category)
    if entity_type and entity_type != "All":
        query = query.filter(AuditLog.entity_type == entity_type)
    if status and status != "All":
        query = query.filter(AuditLog.status == status)
    if start_date:
        query = query.filter(AuditLog.created_at >= start_date)
    if end_date:
        query = query.filter(AuditLog.created_at <= end_date + timedelta(days=1))
    return query.order_by(AuditLog.created_at.desc())


def serialize_log(log):
    return {
        "audit_id": log.audit_id, "user_id": log.user_id, "user_name": log.user_name,
        "action": log.action, "module": log.module, "status": log.status,
        "resource": log.resource, "description": log.description, "ip_address": log.ip_address,
        "entity_type": log.entity_type, "entity_id": log.entity_id, "category": log.category,
        "severity": log.severity, "old_value": log.old_value, "new_value": log.new_value,
        "created_at": log.created_at.isoformat() if log.created_at else None,
    }


def summary(db: Session):
    rows = db.query(AuditLog.category).all()
    categories = ["Activity", "Contract", "Approval", "Security", "Change"]
    return {"total": len(rows), "categories": {name: sum(row[0] == name for row in rows) for name in categories}}


def seed_audit_data(db: Session):
    if db.query(AuditLog).count():
        return 0
    records = [
        ("Sarah Chen", "logged in", "Authentication", "Activity", "User", "USR-101", "Successful sign-in from company network", "Success"),
        ("James Wilson", "viewed contract", "Contracts", "Activity", "Contract", "CNT-2025-001", "Viewed Microsoft Azure Enterprise Agreement", "Success"),
        ("Emily Davis", "updated contract value", "Contracts", "Change", "Contract", "CNT-2025-004", "Updated Oracle Database Enterprise License value", "Success"),
        ("Michael Brown", "changed obligation status", "Obligations", "Change", "Obligation", "OBL-218", "Marked quarterly security review as completed", "Success"),
        ("Legal Department", "approved renewal", "Renewals", "Approval", "Renewal", "CNT-2025-010", "Approved Zoom Enterprise Video Platform renewal", "Success"),
        ("Finance Director", "rejected renewal", "Renewals", "Approval", "Renewal", "CNT-2025-011", "Rejected SAP S/4HANA Cloud License renewal budget", "Warning"),
        ("System", "failed login", "Authentication", "Security", "User", "USR-104", "Failed login attempt for David Martinez", "Warning"),
        ("Sarah Chen", "changed user role", "Users", "Security", "User", "USR-118", "Changed analyst role to Contract Manager", "Success"),
        ("Lisa Anderson", "created contract", "Contracts", "Contract", "Contract", "CNT-2025-016", "Created DocuSign enterprise contract", "Success"),
        ("Robert Taylor", "archived contract", "Contracts", "Contract", "Contract", "CNT-2024-089", "Archived expired vendor agreement", "Success"),
        ("Compliance Officer", "viewed compliance record", "Compliance", "Activity", "Compliance", "CMP-009", "Reviewed GDPR processing requirement", "Success"),
        ("System", "permission denied", "Users", "Security", "User", "USR-122", "Blocked unauthorised user-management access", "Warning"),
    ]
    for index, item in enumerate(records * 2):
        user, action, module, category, entity_type, entity_id, description, status = item
        created_at = datetime.utcnow() - timedelta(hours=index * 7)
        db.add(AuditLog(user_name=user, action=action, module=module, category=category,
                        entity_type=entity_type, entity_id=entity_id, description=description,
                        status=status, severity="Warning" if status == "Warning" else "Info",
                        ip_address=f"10.24.8.{20 + index}",
                        old_value='{"status": "Pending"}' if category in ("Change", "Approval") else None,
                        new_value='{"status": "Completed"}' if category in ("Change", "Approval") else None,
                        created_at=created_at))
        db.add(Activity(user_name=user, action=action, description=description, entity_type=entity_type,
                        entity_id=entity_id, created_at=created_at))
    db.commit()
    return len(records) * 2


def export_logs(logs, report_format):
    if report_format.lower() == "pdf":
        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("ContractIQ Audit Report")
        pdf.setFont("Helvetica-Bold", 16); pdf.drawString(45, 755, "ContractIQ Audit Report")
        pdf.setFont("Helvetica", 9); y = 730
        for log in logs:
            line = f"{log.created_at:%Y-%m-%d %H:%M} | {log.category} | {log.user_name} | {log.description}"
            pdf.drawString(45, y, line[:120]); y -= 18
            if y < 45: pdf.showPage(); pdf.setFont("Helvetica", 9); y = 755
        pdf.save(); return buffer.getvalue(), "application/pdf", "audit-report.pdf"
    output = io.StringIO(); writer = csv.writer(output)
    writer.writerow(["Timestamp", "User", "Category", "Entity type", "Entity ID", "Action", "Description", "Severity"])
    for log in logs:
        writer.writerow([log.created_at, log.user_name, log.category, log.entity_type, log.entity_id, log.action, log.description, log.severity])
    return output.getvalue().encode(), "text/csv", "audit-report.csv"

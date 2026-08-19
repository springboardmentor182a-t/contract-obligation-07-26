import csv
import io
import json
from datetime import datetime, timedelta

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy import inspect, or_, text, func
from sqlalchemy.orm import Session

import entities.user  # noqa: F401
import entities.notification  # noqa: F401
import entities.users_settings  # noqa: F401
from entities.audit_logs import Activity, AuditLog


def ensure_audit_schema(db: Session):
    """Additive upgrade for databases created before the enriched audit model."""
    try:
        inspector = inspect(db.bind)
        if "audit_logs" not in inspector.get_table_names():
            AuditLog.__table__.create(db.bind, checkfirst=True)
        existing = {column["name"] for column in inspect(db.bind).get_columns("audit_logs")}
        additions = {
            "entity_type": "VARCHAR(100)",
            "entity_id": "VARCHAR(100)",
            "category": "VARCHAR(50) DEFAULT 'Activity'",
            "severity": "VARCHAR(50) DEFAULT 'Info'",
            "old_value": "TEXT",
            "new_value": "TEXT",
        }
        for name, definition in additions.items():
            if name not in existing:
                db.execute(text(f"ALTER TABLE audit_logs ADD COLUMN {name} {definition}"))
        if "activities" not in inspector.get_table_names():
            Activity.__table__.create(db.bind, checkfirst=True)
        db.commit()
    except Exception as exc:
        db.rollback()
        print(f"Audit schema check warning: {exc}")


def create_audit_log(
    db: Session,
    user_id=None,
    user_name="System",
    action="viewed",
    status="Success",
    module="System",
    description="",
    resource=None,
    ip_address=None,
    entity_type=None,
    entity_id=None,
    category="Activity",
    severity="Info",
    old_value=None,
    new_value=None,
):
    """Record detailed audit trail and its activity-feed counterpart safely."""
    try:
        ensure_audit_schema(db)
        log = AuditLog(
            user_id=user_id,
            user_name=user_name or "System",
            action=action,
            status=status,
            module=module,
            description=description,
            resource=resource,
            ip_address=ip_address or "127.0.0.1",
            entity_type=entity_type or module,
            entity_id=str(entity_id) if entity_id is not None else None,
            category=category,
            severity=severity,
            old_value=json.dumps(old_value, indent=2) if isinstance(old_value, (dict, list)) else (str(old_value) if old_value is not None else None),
            new_value=json.dumps(new_value, indent=2) if isinstance(new_value, (dict, list)) else (str(new_value) if new_value is not None else None),
        )
        db.add(log)
        db.add(
            Activity(
                user_id=user_id,
                user_name=user_name or "System",
                action=action,
                description=description,
                entity_type=entity_type or module,
                entity_id=str(entity_id) if entity_id is not None else None,
            )
        )
        db.commit()
        db.refresh(log)
        return log
    except Exception as exc:
        db.rollback()
        print(f"Failed to record audit log: {exc}")
        return None


def query_logs(
    db: Session,
    search=None,
    category=None,
    module=None,
    severity=None,
    entity_type=None,
    status=None,
    start_date=None,
    end_date=None,
):
=======
import csv
import io
import json
from datetime import datetime, timedelta

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy import inspect, or_, text
from sqlalchemy.orm import Session

from src.entities.audit_logs import Activity, AuditLog

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
>>>>>>> origin/main-group-A
    query = db.query(AuditLog)
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                AuditLog.user_name.ilike(term),
                AuditLog.action.ilike(term),
                AuditLog.description.ilike(term),
                AuditLog.entity_id.ilike(term),
                AuditLog.entity_type.ilike(term),
                AuditLog.module.ilike(term),
                AuditLog.ip_address.ilike(term),
            )
        )
    if category and category != "All":
<<<<<<< HEAD
        if category == "Contract":
            query = query.filter(or_(AuditLog.category == "Contract", AuditLog.module == "Contracts", AuditLog.entity_type == "Contract"))
        elif category == "Security":
            query = query.filter(or_(AuditLog.category == "Security", AuditLog.module.in_(["Authentication", "Users"]), AuditLog.severity.in_(["Warning", "Error", "Critical"])))
        elif category == "Approval":
            query = query.filter(or_(AuditLog.category == "Approval", AuditLog.action.ilike("%approved%"), AuditLog.action.ilike("%rejected%")))
        elif category == "Change":
            query = query.filter(or_(AuditLog.category == "Change", AuditLog.old_value.isnot(None), AuditLog.new_value.isnot(None)))
        elif category == "Reports":
            query = query.filter(or_(AuditLog.category == "Reports", AuditLog.module == "Reports"))
        elif category == "Activity":
            query = query.filter(or_(AuditLog.category == "Activity", AuditLog.category == "User Activity"))
        else:
            query = query.filter(AuditLog.category == category)
    if module and module != "All":
        query = query.filter(AuditLog.module == module)
    if severity and severity != "All":
        query = query.filter(AuditLog.severity == severity)
=======
        query = query.filter(AuditLog.category == category)
    else:
        query = query.filter(AuditLog.category != "Activity")
    
>>>>>>> origin/main-group-A
    if entity_type and entity_type != "All":
        query = query.filter(AuditLog.entity_type == entity_type)
    if status and status != "All":
        query = query.filter(AuditLog.status == status)
    if start_date:
        query = query.filter(AuditLog.created_at >= start_date)
    if end_date:
        query = query.filter(AuditLog.created_at <= end_date + timedelta(days=1))
    return query.order_by(AuditLog.created_at.desc())


def get_entity_history(db: Session, entity_type: str, entity_id: str):
    """Retrieve audit history for a specific entity (e.g. Contract or Renewal)."""
    return (
        db.query(AuditLog)
        .filter(AuditLog.entity_type.ilike(entity_type), AuditLog.entity_id == str(entity_id))
        .order_by(AuditLog.created_at.desc())
        .all()
    )


def serialize_log(log: AuditLog):
    return {
        "audit_id": log.audit_id,
        "user_id": log.user_id,
        "user_name": log.user_name,
        "action": log.action,
        "module": log.module,
        "status": log.status,
        "resource": log.resource,
        "description": log.description,
        "ip_address": log.ip_address,
        "entity_type": log.entity_type,
        "entity_id": log.entity_id,
        "category": log.category,
        "severity": log.severity,
        "old_value": log.old_value,
        "new_value": log.new_value,
        "created_at": log.created_at.isoformat() if log.created_at else None,
    }


def summary(db: Session):
<<<<<<< HEAD
    ensure_audit_schema(db)
    seed_audit_data(db)
    all_logs = db.query(AuditLog).all()

    activity_count = sum(1 for l in all_logs if l.category in ["Activity", "User Activity"] or l.module in ["Users", "Authentication"])
    contract_count = sum(1 for l in all_logs if l.category == "Contract" or l.module == "Contracts" or l.entity_type == "Contract")
    approval_count = sum(1 for l in all_logs if l.category == "Approval" or "approved" in (l.action or "").lower() or "rejected" in (l.action or "").lower())
    security_count = sum(1 for l in all_logs if l.category == "Security" or l.severity in ["Warning", "Error", "Critical"] or l.module in ["Authentication", "Users"])
    change_count = sum(1 for l in all_logs if l.category == "Change" or l.old_value is not None or l.new_value is not None)
    reports_count = sum(1 for l in all_logs if l.category == "Reports" or l.module == "Reports")

    return {
        "total": len(all_logs),
        "categories": {
            "Activity": activity_count,
            "Contract": contract_count,
            "Approval": approval_count,
            "Security": security_count,
            "Change": change_count,
            "Reports": reports_count,
        },
    }


def get_audit_analytics(db: Session):
    """Provide detailed analytical metrics for Audit Reports dashboard."""
    ensure_audit_schema(db)
    seed_audit_data(db)
    all_logs = db.query(AuditLog).all()
    total = len(all_logs)

    category_counts = {
        "Activity": sum(1 for l in all_logs if l.category in ["Activity", "User Activity"]),
        "Contract": sum(1 for l in all_logs if l.category == "Contract" or l.module == "Contracts"),
        "Approval": sum(1 for l in all_logs if l.category == "Approval" or "approved" in (l.action or "").lower()),
        "Security": sum(1 for l in all_logs if l.category == "Security" or l.severity in ["Warning", "Error"]),
        "Change": sum(1 for l in all_logs if l.category == "Change" or l.old_value is not None),
        "Reports": sum(1 for l in all_logs if l.category == "Reports" or l.module == "Reports"),
    }

    severity_counts = {}
    module_counts = {}
    user_counts = {}

    for log in all_logs:
        sev = log.severity or "Info"
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

        mod = log.module or "System"
        module_counts[mod] = module_counts.get(mod, 0) + 1

        usr = log.user_name or "System"
        user_counts[usr] = user_counts.get(usr, 0) + 1

    top_users = sorted(
        [{"name": k, "count": v} for k, v in user_counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )[:5]

    return {
        "total_events": total,
        "category_counts": category_counts,
        "severity_counts": severity_counts,
        "module_counts": module_counts,
        "top_users": top_users,
        "security_warnings": severity_counts.get("Warning", 0) + severity_counts.get("Error", 0) + severity_counts.get("Critical", 0),
    }
=======
    rows = db.query(AuditLog.category).all()
    categories = ["Contract", "Approval", "Security", "Change"]
    valid_rows = [row for row in rows if row[0] != "Activity"]
    return {"total": len(valid_rows), "categories": {name: sum(row[0] == name for row in valid_rows) for name in categories}}
>>>>>>> origin/main-group-A


def seed_audit_data(db: Session):
    """Seed data disabled: only real system audit events generated by actual user actions are stored."""
    return 0

    records = [
<<<<<<< HEAD
        # (user_name, action, module, category, entity_type, entity_id, description, status, severity, ip, old_val, new_val)
        (
            "Sarah Chen",
            "logged in",
            "Authentication",
            "Activity",
            "User",
            "USR-101",
            "Successful user sign-in from office subnet",
            "Success",
            "Info",
            "10.24.8.101",
            None,
            '{"status": "Active", "session_started": "2026-08-11T09:00:00Z"}',
        ),
        (
            "James Wilson",
            "viewed contract",
            "Contracts",
            "Contract",
            "Contract",
            "CNT-2025-001",
            "Opened and reviewed Microsoft Azure Enterprise Agreement",
            "Success",
            "Info",
            "10.24.8.105",
            None,
            '{"viewed_by": "James Wilson", "document": "Azure_Agreement_2025.pdf"}',
        ),
        (
            "Lisa Anderson",
            "created contract",
            "Contracts",
            "Contract",
            "Contract",
            "CNT-2025-016",
            "Created DocuSign Enterprise Subscription contract record",
            "Success",
            "Info",
            "10.24.8.130",
            None,
            '{"contract_id": "CNT-2025-016", "title": "DocuSign Enterprise", "owner": "Lisa Anderson", "value": 75000}',
        ),
        (
            "Robert Taylor",
            "archived contract",
            "Contracts",
            "Contract",
            "Contract",
            "CNT-2024-089",
            "Archived expired vendor service agreement for legacy hardware maintenance",
            "Success",
            "Info",
            "10.24.8.135",
            '{"status": "Expired", "is_archived": false}',
            '{"status": "Archived", "is_archived": true, "archive_reason": "Contract ended"}',
        ),
        (
            "Emily Davis",
            "updated contract value",
            "Contracts",
            "Change",
            "Contract",
            "CNT-2025-004",
            "Updated Oracle Database Enterprise License contract value from $120,000 to $145,000",
            "Success",
            "Info",
            "10.24.8.112",
            '{"contract_value": 120000, "currency": "USD"}',
            '{"contract_value": 145000, "currency": "USD", "reason": "Added 50 core licenses"}',
        ),
        (
            "Michael Brown",
            "changed obligation status",
            "Obligations",
            "Change",
            "Obligation",
            "OBL-218",
            "Marked quarterly SOC2 compliance security review as completed",
            "Success",
            "Info",
            "10.24.8.115",
            '{"status": "Pending", "due_date": "2026-08-15"}',
            '{"status": "Completed", "completed_at": "2026-08-11", "verified_by": "Michael Brown"}',
        ),
        (
            "Legal Department",
            "approved renewal",
            "Renewals",
            "Approval",
            "Renewal",
            "CNT-2025-010",
            "Approved Zoom Enterprise Video Platform renewal for fiscal year 2026",
            "Success",
            "Info",
            "10.24.8.120",
            '{"approval_status": "Pending Review", "step": "Legal Review"}',
            '{"approval_status": "Approved", "approver": "Legal Manager", "step": "Final Approval"}',
        ),
        (
            "Finance Director",
            "rejected renewal",
            "Renewals",
            "Approval",
            "Renewal",
            "CNT-2025-011",
            "Rejected SAP S/4HANA Cloud License renewal budget due to price escalation",
            "Warning",
            "Warning",
            "10.24.8.122",
            '{"approval_status": "Pending", "requested_amount": 250000}',
            '{"approval_status": "Rejected", "comments": "Price increase exceeds 15% cap limit"}',
        ),
        (
            "Legal Department",
            "approved contract sign-off",
            "Contracts",
            "Approval",
            "Contract",
            "CNT-2025-022",
            "Signed off on AWS Master Service Agreement legal terms",
            "Success",
            "Info",
            "10.24.8.120",
            '{"legal_review_status": "In Progress"}',
            '{"legal_review_status": "Approved", "signature_hash": "a8f9c1b3e70d44e"}',
        ),
        (
            "System",
            "failed login",
            "Authentication",
            "Security",
            "User",
            "USR-104",
            "Multiple failed login attempts detected for account David Martinez",
            "Warning",
            "Warning",
            "192.168.1.88",
            '{"failed_attempts": 2}',
            '{"failed_attempts": 5, "account_locked": false, "warning": "Suspicious IP"}',
        ),
        (
            "Sarah Chen",
            "changed user role",
            "Users",
            "Security",
            "User",
            "USR-118",
            "Elevated user role from Analyst to Contract Manager",
            "Success",
            "Info",
            "10.24.8.101",
            '{"role": "Analyst", "permissions": ["view_contracts"]}',
            '{"role": "Contract Manager", "permissions": ["view_contracts", "edit_contracts", "approve_renewals"]}',
        ),
        (
            "System",
            "permission denied",
            "Users",
            "Security",
            "User",
            "USR-122",
            "Blocked unauthorized attempt to edit system configuration",
            "Warning",
            "Warning",
            "192.168.45.12",
            '{"action_attempted": "modify_admin_settings"}',
            '{"result": "Access Denied", "reason": "Insufficient role privileges"}',
        ),
        (
            "Compliance Officer",
            "viewed compliance record",
            "Compliance",
            "Activity",
            "Compliance",
            "CMP-009",
            "Reviewed GDPR data processing compliance audit requirement",
            "Success",
            "Info",
            "10.24.8.140",
            None,
            '{"compliance_id": "CMP-009", "regulation": "GDPR Article 28", "status": "Compliant"}',
        ),
        (
            "Sarah Chen",
            "generated audit report",
            "Reports",
            "Reports",
            "Audit Report",
            "RPT-2026-08",
            "Exported monthly system activity and security audit report in PDF format",
            "Success",
            "Info",
            "10.24.8.101",
            None,
            '{"report_type": "Audit Trail", "format": "PDF", "rows_exported": 150}',
        ),
        (
            "James Wilson",
            "updated obligation owner",
            "Obligations",
            "Change",
            "Obligation",
            "OBL-304",
            "Reassigned SLA compliance obligation from Alex Rivera to Priyanshu Sharma",
            "Success",
            "Info",
            "10.24.8.105",
            '{"assigned_to": "Alex Rivera"}',
            '{"assigned_to": "Priyanshu Sharma", "reassigned_by": "James Wilson"}',
        ),
        (
            "System",
            "password reset request",
            "Authentication",
            "Security",
            "User",
            "USR-115",
            "Initiated password reset workflow for user token",
            "Success",
            "Info",
            "10.24.8.115",
            '{"password_reset_pending": false}',
            '{"password_reset_pending": true, "otp_sent": true}',
        ),
    ]

    count = 0
    now = datetime.utcnow()
    for idx, item in enumerate(records * 2):
        (
            user,
            action,
            module,
            category,
            entity_type,
            entity_id,
            description,
            status,
            severity,
            ip,
            old_val,
            new_val,
        ) = item

        created_at = now - timedelta(hours=idx * 4)
        log = AuditLog(
            user_name=user,
            action=action,
            module=module,
            category=category,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            status=status,
            severity=severity,
            ip_address=ip,
            old_value=old_val,
            new_value=new_val,
            created_at=created_at,
        )
        db.add(log)
        db.add(
            Activity(
                user_name=user,
                action=action,
                description=description,
                entity_type=entity_type,
                entity_id=entity_id,
                created_at=created_at,
            )
        )
        count += 1

    db.commit()
    return count


def export_logs(logs, report_format):
    if report_format.lower() == "pdf":
        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("ContractIQ Audit & Activity Report")

        # Header banner
        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(45, 755, "ContractIQ Audit & Activity Report")
        pdf.setFont("Helvetica", 9)
        pdf.drawString(45, 740, f"Generated: {datetime.utcnow():%Y-%m-%d %H:%M UTC} | Total Records: {len(logs)}")
        pdf.line(45, 732, 567, 732)

        # Table Column headers
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(45, 715, "Timestamp")
        pdf.drawString(130, 715, "User / Actor")
        pdf.drawString(220, 715, "Category")
        pdf.drawString(285, 715, "Module")
        pdf.drawString(350, 715, "Action")
        pdf.drawString(450, 715, "Status")

        pdf.line(45, 708, 567, 708)

        pdf.setFont("Helvetica", 8)
        y = 692
        page_num = 1

        for log in logs:
            dt_str = log.created_at.strftime("%Y-%m-%d %H:%M") if log.created_at else "N/A"
            user_str = (log.user_name or "System")[:16]
            cat_str = (log.category or "Activity")[:10]
            mod_str = (log.module or "System")[:10]
            act_str = (log.action or "")[:20]
            stat_str = (log.status or "Success")[:10]

            pdf.drawString(45, y, dt_str)
            pdf.drawString(130, y, user_str)
            pdf.drawString(220, y, cat_str)
            pdf.drawString(285, y, mod_str)
            pdf.drawString(350, y, act_str)
            pdf.drawString(450, y, stat_str)

            y -= 16
            if y < 45:
                pdf.setFont("Helvetica-Oblique", 8)
                pdf.drawString(500, 25, f"Page {page_num}")
                pdf.showPage()
                page_num += 1
                pdf.setFont("Helvetica-Bold", 18)
                pdf.drawString(45, 755, "ContractIQ Audit & Activity Report")
                pdf.setFont("Helvetica-Bold", 9)
                pdf.drawString(45, 715, "Timestamp")
                pdf.drawString(130, 715, "User / Actor")
                pdf.drawString(220, 715, "Category")
                pdf.drawString(285, 715, "Module")
                pdf.drawString(350, 715, "Action")
                pdf.drawString(450, 715, "Status")
                pdf.line(45, 708, 567, 708)
                pdf.setFont("Helvetica", 8)
                y = 692

        pdf.setFont("Helvetica-Oblique", 8)
        pdf.drawString(500, 25, f"Page {page_num}")
        pdf.save()
        return buffer.getvalue(), "application/pdf", "contractiq-audit-report.pdf"

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "Audit ID",
            "Timestamp",
            "User",
            "Category",
            "Module",
            "Entity Type",
            "Entity ID",
            "Action",
            "Description",
            "Severity",
            "Status",
            "IP Address",
            "Old Value",
            "New Value",
        ]
    )
    for log in logs:
        writer.writerow(
            [
                log.audit_id,
                log.created_at,
                log.user_name,
                log.category,
                log.module,
                log.entity_type,
                log.entity_id,
                log.action,
                log.description,
                log.severity,
                log.status,
                log.ip_address,
                log.old_value,
                log.new_value,
            ]
        )
    return output.getvalue().encode("utf-8"), "text/csv", "contractiq-audit-report.csv"


def query_activities(db: Session, limit: int = 50):
    return db.query(Activity).order_by(Activity.created_at.desc()).limit(limit).all()


def serialize_activity(activity):
    return {
        "activity_id": activity.activity_id,
        "user_id": activity.user_id,
        "user_name": activity.user_name,
        "action": activity.action,
        "description": activity.description,
        "entity_type": activity.entity_type,
        "entity_id": activity.entity_id,
        "created_at": activity.created_at.isoformat() if activity.created_at else None,
    }

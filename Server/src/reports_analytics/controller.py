from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
from sqlalchemy.sql import func
import os
from fastapi.responses import FileResponse

from src.database.core import get_db
from src.reports_analytics.service import ReportService
from src.users.service import admin_required
from src.entities.user import User
from src.entities.report import Report
from src.entities.contract import Contract
from src.entities.renewal import Renewal
from src.entities.audit_logs import AuditLog
from src.entities.obligation import Obligation
from src.entities.compliance import Compliance
from src.reports_analytics.generate_pdf import create_pdf
from src.reports_analytics.generate_csv import create_csv
from src.reports_analytics.models import ReportRequest, ReportResponse
from src.audit_logs.service import create_audit_log

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/contract-reports/{days}")
def contract_reports(
    days: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return ReportService.contract_report(db, days)


@router.get("/obligation-reports/{days}")
def obligation_reports(
    days: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return ReportService.obligation_report(db, days)


@router.get("/renewal-reports/{days}")
def renewal_reports(
    days: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return ReportService.renewal_report(db, days)


@router.get("/compliance-reports/{days}")
def compliance_reports(
    days: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return ReportService.compliance_report(db, days)


@router.get("/audit-reports/{days}")
def audit_reports(
    days: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return ReportService.audit_report(db, days)


@router.get("/contract-quarter-graph")
def contract_graph(
    current_user: User = Depends(admin_required), db: Session = Depends(get_db)
):
    data = (
        db.query(
            extract("year", Contract.created_at).label("year"),
            extract("quarter", Contract.created_at).label("quarter"),
            func.sum(Contract.value).label("total"),
        )
        .group_by(
            extract("year", Contract.created_at), extract("quarter", Contract.created_at)
        )
        .order_by(
            extract("year", Contract.created_at), extract("quarter", Contract.created_at)
        )
        .all()
    )
    return [
        {"year": int(d.year), "quarter": int(d.quarter), "total": d.total} for d in data
    ]


@router.get("/compliance-status-graph")
def compliance_status_graph(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    data = (
        db.query(
            Compliance.status.label("status"),
            func.count(Compliance.compliance_id).label("count"),
        )
        .group_by(Compliance.status)
        .all()
    )

    return [{"status": str(d.status), "count": d.count} for d in data]


@router.get("/obligation-status-graph")
def obligation_status_graph(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    data = (
        db.query(
            Obligation.status.label("status"),
            func.count(Obligation.obligation_id).label("count"),
        )
        .group_by(Obligation.status)
        .all()
    )

    return [{"status": str(d.status), "count": d.count} for d in data]


@router.get("/renewal-monthly-graph")
def renewal_monthly_graph(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    data = (
        db.query(
            extract("year", Renewal.renewal_date).label("year"),
            extract("month", Renewal.renewal_date).label("month"),
            func.count(Renewal.renewal_id).label("count"),
        )
        .group_by(
            extract("year", Renewal.renewal_date),
            extract("month", Renewal.renewal_date),
        )
        .order_by(
            extract("year", Renewal.renewal_date),
            extract("month", Renewal.renewal_date),
        )
        .all()
    )

    return [
        {"year": int(d.year), "month": int(d.month), "count": d.count} for d in data
    ]


@router.get("/audit-action-graph")
def audit_action_graph(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    data = (
        db.query(
            AuditLog.action.label("action"),
            func.count(AuditLog.audit_id).label("count"),
        )
        .group_by(AuditLog.action)
        .all()
    )

    return [{"action": str(d.action), "count": d.count} for d in data]


@router.get("/saved-reports", response_model=list[ReportResponse])
def reports_analytics(
    current_user: User = Depends(admin_required), db: Session = Depends(get_db)
):
    reports = db.query(Report).all()

    result = []
    for r in reports:
        user = db.query(User).filter(User.user_id == r.generated_by).first()
        full_name = user.full_name if user else f"User {r.generated_by}"

        result.append(
            {
                "report_id": r.report_id,
                "report_name": r.report_name,
                "report_type": r.report_type,
                "generated_by": full_name,
                "file_path": r.file_path,
                "format": r.format,
                "create_at": r.create_at,
            }
        )

    return result


@router.post("/generate-report")
async def generate_report(
    request: ReportRequest,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    if request.type == "Contract":
        report = ReportService.contract_report(db, days=request.days)
    elif request.type == "Compliance":
        report = ReportService.compliance_report(db, days=request.days)
    elif request.type == "Obligations":
        report = ReportService.obligation_report(db, days=request.days)
    elif request.type == "Renewal":
        report = ReportService.renewal_report(db, days=request.days)
    elif request.type == "Audit":
        report = ReportService.audit_report(db, days=request.days)

    if request.format.lower() == "pdf":
        filename = await create_pdf(request.report_name, report)
    else:
        filename = await create_csv(request.report_name, report)

    report = Report(
        report_name=request.report_name,
        report_type=request.type,
        generated_by=current_user.user_id,
        file_path=filename,
        format=request.format,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/download-report/{filename}")
def download_report(
    filename: str, 
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db)
):
    if os.path.exists(filename):
        create_audit_log(
            db=db,
            user_id=current_user.user_id,
            user_name=current_user.full_name,
            status="success",
            action="download report",
            module="Reports",
            description=f"User downloaded report: {filename}",
        )
        return FileResponse(
            path=filename, filename=filename, media_type="application/pdf"
        )
    return {"detail": "File not found"}

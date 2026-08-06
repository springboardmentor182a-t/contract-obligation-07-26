from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case
from datetime import datetime, timedelta, timezone

from src.entities.user import User
from src.entities.contract import Contract
from src.entities.obligation import Obligation
from src.entities.renewal import Renewal
from src.entities.compliance import Compliance
...


class DashboardService:
    @staticmethod
    def get_admin_dashboard(db: Session):
        total_users = db.query(User).count()
        active_contracts = db.query(Contract).filter(Contract.status == "Active").count()
        
        # Expiring in 90 days
        expiry_date = datetime.now(timezone.utc) + timedelta(days=90)
        expiring_contracts = db.query(Contract).filter(
            Contract.status == "Active",
            Contract.effective_date<= expiry_date
        ).count()
        
        total_compliances = db.query(Compliance).count()
        completed_compliances = db.query(Compliance).filter(Compliance.status == ComplianceStatus.COMPLETED.name).count()
        compliance_percentage = round((completed_compliances / total_compliances) * 100, 1) if total_compliances else 100.0

        # Monthly Contract Volume (Last 6 months)
        six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
        volume_data = (
            db.query(
                extract("year", Contract.created_at).label("year"),
                extract("month", Contract.created_at).label("month"),
                func.count(Contract.contract_id).label("count"),
            )
            .filter(Contract.created_at >= six_months_ago)
            .group_by(extract("year", Contract.created_at), extract("month", Contract.created_at))
            .order_by(extract("year", Contract.created_at), extract("month", Contract.created_at))
            .all()
        )
        
        monthly_volume = [{"year": int(d.year), "month": int(d.month), "count": d.count} for d in volume_data]

        # Fetch Recent Notifications
        recent_notifications_data = db.query(Notification).order_by(Notification.date.desc()).limit(3).all()
        recent_notifications = [{"title": n.title, "message": n.message, "date": n.date.isoformat() if n.date else None} for n in recent_notifications_data]

        # Fetch Activity Logs
        activity_logs_data = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(5).all()
        activity_logs = [{
            "action": a.action,
            "user_name": a.user_name,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "status": a.status
        } for a in activity_logs_data]

        # System Health (Mocked hardware metrics)
        system_health = {
            "api_response": "142ms",
            "database_load": "38%",
            "storage": "2.4/10 TB",
            "active_sessions": total_users,
            "failed_logins": "2 (24h)",
            "status": "All systems operational"
        }

        return {
            "total_users": total_users,
            "active_contracts": active_contracts,
            "expiring_contracts": expiring_contracts,
            "compliance_overview": compliance_percentage,
            "monthly_volume": monthly_volume,
            "recent_notifications": recent_notifications,
            "activity_logs": activity_logs,
            "system_health": system_health,
        }

    @staticmethod
    def get_legal_manager_dashboard(db: Session):
        pending_approvals = db.query(Contract).filter(Contract.status == "Under Review").count()
        active_contracts = db.query(Contract).filter(Contract.status == "Active").count()
        draft_contracts = db.query(Contract).filter(Contract.status == "Draft").count()
        
        upcoming_renewals = db.query(Renewal).filter(
            Renewal.expiry_date >= datetime.now(timezone.utc),
            Renewal.expiry_date <= datetime.now(timezone.utc) + timedelta(days=60)
        ).count()

        # Contract Status Breakdown
        status_data = db.query(Contract.status, func.count(Contract.contract_id)).group_by(Contract.status).all()
        contract_status = [{"status": s, "count": c} for s, c in status_data]

        # Approval Timeline (mocked dynamically)
        approval_timeline = {
            "labels": ["W1", "W2", "W3", "W4"],
            "data": [int(active_contracts * 0.1), int(active_contracts * 0.15), int(active_contracts * 0.2), int(active_contracts * 0.1)]
        }

        # Approval Queue
        approval_queue_data = db.query(Contract).filter(Contract.status.in_(["Under Review", "Renewal Due"])).order_by(Contract.contract_id.desc()).limit(5).all()
        approval_queue = [{
            "contract_id": c.contract_id,
            "titile": c.titile,
            "vendor_name": c.vendor_name,
            "contract_value": float(c.contract_value) if c.contract_value else 0.0,
            "status": c.status
        } for c in approval_queue_data]

        # Legal Reports
        legal_reports_data = db.query(Report).order_by(Report.create_at.desc()).limit(3).all()
        legal_reports = [{
            "report_name": r.report_name,
            "report_type": r.report_type,
            "format": r.format,
            "create_at": r.create_at.isoformat() if r.create_at else None
        } for r in legal_reports_data]

        return {
            "pending_approvals": pending_approvals,
            "active_contracts": active_contracts,
            "draft_contracts": draft_contracts,
            "upcoming_renewals": upcoming_renewals,
            "contract_status": contract_status,
            "approval_timeline": approval_timeline,
            "approval_queue": approval_queue,
            "legal_reports": legal_reports,
        }

    @staticmethod
    def get_compliance_officer_dashboard(db: Session):
        total_compliances = db.query(Compliance).count()
        completed_compliances = db.query(Compliance).filter(Compliance.status == ComplianceStatus.COMPLETED.name).count()
        compliance_score = round((completed_compliances / total_compliances) * 100, 1) if total_compliances else 100.0

        pending_obligations = db.query(Obligation).filter(Obligation.completed == False).count()
        missed_deadlines = db.query(Obligation).filter(Obligation.completed == False, Obligation.due_date < datetime.now(timezone.utc)).count()
        
        high_risk_contracts = db.query(Compliance).filter(Compliance.risk_level == RiskLevel.HIGH.name).count()

        # Real department compliance
        dept_data = db.query(
            Contract.department,
            func.count(Compliance.compliance_id).label("total"),
            func.sum(case((Compliance.status == ComplianceStatus.COMPLETED.name, 1), else_=0)).label("completed")
        ).join(Compliance, Contract.contract_id == Compliance.contract_id).group_by(Contract.department).all()

        department_compliance = []
        for d in dept_data:
            score = round((d.completed / d.total) * 100, 1) if d.total > 0 else 100.0
            department_compliance.append({
                "department": d.department,
                "score": score
            })

        # Compliance Score Trend (real - last 6 months)
        six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
        trend_data = db.query(
            extract("year", Compliance.created_at).label("year"),
            extract("month", Compliance.created_at).label("month"),
            func.count(Compliance.compliance_id).label("total"),
            func.sum(case((Compliance.status == ComplianceStatus.COMPLETED.name, 1), else_=0)).label("completed")
        ).filter(Compliance.created_at >= six_months_ago)\
        .group_by(extract("year", Compliance.created_at), extract("month", Compliance.created_at))\
        .order_by(extract("year", Compliance.created_at), extract("month", Compliance.created_at)).all()

        trend_labels = []
        trend_scores = []
        for t in trend_data:
            month_name = datetime(int(t.year), int(t.month), 1).strftime('%b')
            trend_labels.append(month_name)
            score = round((t.completed / t.total) * 100, 1) if t.total > 0 else 100.0
            trend_scores.append(score)

        compliance_score_trend = {
            "labels": trend_labels,
            "data": trend_scores
        }

        # Audit Summary
        audit_summary_data = db.query(AuditLog).filter(AuditLog.module.in_(["Compliance", "Security", "Authentication"])).order_by(AuditLog.created_at.desc()).limit(3).all()
        audit_summary = [{
            "action": a.action,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "status": a.status
        } for a in audit_summary_data]

        return {
            "compliance_score": compliance_score,
            "pending_obligations": pending_obligations,
            "missed_deadlines": missed_deadlines,
            "high_risk_contracts": high_risk_contracts,
            "department_compliance": department_compliance,
            "compliance_score_trend": compliance_score_trend,
            "audit_summary": audit_summary,
        }

    @staticmethod
    def get_contract_manager_dashboard(db: Session, user_id: int = None):
        # In a real scenario, this might filter by user_id
        assigned_contracts = db.query(Contract).filter(Contract.status.in_(["Active", "Renewal Due", "Under Review"])).count()
        draft_contracts = db.query(Contract).filter(Contract.status == "Draft").count()
        pending_reviews = db.query(Contract).filter(Contract.status == "Under Review").count()
        
        expiry_date = datetime.now(timezone.utc) + timedelta(days=90)
        expiring_contracts = db.query(Contract).filter(
            Contract.status == "Active",
            Contract.expiry_date <= expiry_date
        ).count()

        # Portfolio Growth (real cumulative growth over 6 months)
        six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
        growth_data = db.query(
            extract("year", Contract.created_at).label("year"),
            extract("month", Contract.created_at).label("month"),
            func.count(Contract.contract_id).label("count")
        ).filter(Contract.created_at >= six_months_ago)\
        .group_by(extract("year", Contract.created_at), extract("month", Contract.created_at))\
        .order_by(extract("year", Contract.created_at), extract("month", Contract.created_at)).all()

        growth_labels = []
        growth_counts = []
        cumulative = db.query(Contract).filter(Contract.created_at < six_months_ago).count()
        for g in growth_data:
            month_name = datetime(int(g.year), int(g.month), 1).strftime('%b')
            growth_labels.append(month_name)
            cumulative += g.count
            growth_counts.append(cumulative)
            
        portfolio_growth = {
            "labels": growth_labels,
            "data": growth_counts
        }

        # Renewal Calendar
        renewal_calendar_data = db.query(Contract).filter(Contract.expiry_date != None, Contract.status != "Expired").order_by(Contract.expiry_date.asc()).limit(5).all()
        renewal_calendar = [{
            "titile": c.titile,
            "expiry_date": c.expiry_date.isoformat() if c.expiry_date else None,
        } for c in renewal_calendar_data]

        # Assigned Contracts List
        assigned_contracts_data = db.query(
            Contract,
            func.count(Compliance.compliance_id).label("total_comp"),
            func.sum(case((Compliance.status == ComplianceStatus.COMPLETED.name, 1), else_=0)).label("completed_comp")
        ).outerjoin(Compliance, Contract.contract_id == Compliance.contract_id)\
        .group_by(Contract.contract_id)\
        .order_by(Contract.contract_id.desc()).limit(5).all()

        assigned_contracts_list = [{
            "contract_id": r.Contract.contract_id,
            "titile": r.Contract.titile,
            "vendor_name": r.Contract.vendor_name,
            "category": r.Contract.category,
            "contract_value": float(r.Contract.contract_value) if r.Contract.contract_value else 0.0,
            "expiry_date": r.Contract.expiry_date.isoformat() if r.Contract.expiry_date else None,
            "status": r.Contract.status,
            "compliance_score": round((r.completed_comp / r.total_comp) * 100, 1) if r.total_comp and r.total_comp > 0 else 100.0
        } for r in assigned_contracts_data]

        return {
            "assigned_contracts": assigned_contracts,
            "draft_contracts": draft_contracts,
            "pending_reviews": pending_reviews,
            "expiring_contracts": expiring_contracts,
            "portfolio_growth": portfolio_growth,
            "renewal_calendar": renewal_calendar,
            "assigned_contracts_list": assigned_contracts_list,
        }
# trigger commit to show on git

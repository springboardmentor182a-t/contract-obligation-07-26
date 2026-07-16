from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from sqlalchemy import extract


from entities.contract import Contract
from entities.obligation import Obligation
from entities.renewal import Renewal
from entities.compliance import Compliance, ComplianceStatus, RiskLevel
from entities.audit_logs import AuditLog


class ReportService:

    @staticmethod
    def contract_report(db: Session, days: int):
        start_date = datetime.utcnow() - timedelta(days=days)
        contracts = db.query(Contract).filter(Contract.create_at >= start_date).all()

        total_contract_value = (
            db.query(func.sum(Contract.contract_value))
            .filter(Contract.create_at >= start_date)
            .scalar()
        ) or 0

        active_contracts = (
            db.query(Contract)
            .filter(Contract.create_at >= start_date, Contract.status == "Active")
            .count()
        )

        expired_contracts = (
            db.query(Contract)
            .filter(Contract.create_at >= start_date, Contract.status == "Expired")
            .count()
        )

        upcoming_renewals = (
            db.query(Contract)
            .filter(Contract.create_at >= start_date, Contract.status == "Renewal Due")
            .count()
        )

        completed = (
            db.query(Obligation)
            .filter(
                Obligation.created_at >= start_date, Obligation.status == "Completed"
            )
            .count()
        )

        total = db.query(Obligation).filter(Obligation.created_at >= start_date).count()

        compliance = 0
        if total:
            compliance = round((completed / total) * 100, 2)

        average_execution_days = 0
        approved_contracts = [c for c in contracts if c.approval_date]

        if approved_contracts:
            total_days = sum(
                (c.approval_date - c.create_at).days for c in approved_contracts
            )

            average_execution_days = round(total_days / len(approved_contracts), 2)

        return {
            "period": f"Last {days} Days",
            "total_contract_value": total_contract_value,
            "active_contracts": active_contracts,
            "expired_contracts": expired_contracts,
            "upcoming_renewals": upcoming_renewals,
            "obligation_compliance": compliance,
            "average_execution_days": average_execution_days,
        }

    @staticmethod
    def compliance_report(db: Session, days: int):
        start_date = datetime.utcnow() - timedelta(days=days)

        compliances = (
            db.query(Compliance).filter(Compliance.created_at >= start_date).all()
        )

        total_compliances = len(compliances)

        completed = (
            db.query(Compliance)
            .filter(
                Compliance.created_at >= start_date,
                Compliance.status == ComplianceStatus.COMPLETED.name,
            )
            .count()
        )

        pending = (
            db.query(Compliance)
            .filter(
                Compliance.created_at >= start_date,
                Compliance.status == ComplianceStatus.PENDING.name,
            )
            .count()
        )

        failed = (
            db.query(Compliance)
            .filter(
                Compliance.created_at >= start_date,
                Compliance.status == ComplianceStatus.NON_COMPLIANT.name,
            )
            .count()
        )

        high_risk = (
            db.query(Compliance)
            .filter(
                Compliance.created_at >= start_date,
                Compliance.risk_level == RiskLevel.HIGH.name,
            )
            .count()
        )

        medium_risk = (
            db.query(Compliance)
            .filter(
                Compliance.created_at >= start_date,
                Compliance.risk_level == RiskLevel.MEDIUM.name,
            )
            .count()
        )

        low_risk = (
            db.query(Compliance)
            .filter(
                Compliance.created_at >= start_date,
                Compliance.risk_level == RiskLevel.LOW.name,
            )
            .count()
        )

        average_health_score = (
            db.query(func.avg(Compliance.health_score))
            .filter(
                Compliance.created_at >= start_date, Compliance.health_score.isnot(None)
            )
            .scalar()
        ) or 0

        compliance_percentage = 0

        if total_compliances:
            compliance_percentage = round((completed / total_compliances) * 100, 2)

        return {
            "period": f"Last {days} Days",
            "total_compliances": total_compliances,
            "completed": completed,
            "pending": pending,
            "failed": failed,
            "compliance_percentage": compliance_percentage,
            "high_risk": high_risk,
            "medium_risk": medium_risk,
            "low_risk": low_risk,
            "average_health_score": round(average_health_score, 2),
        }

    @staticmethod
    def obligation_report(db: Session, days: int):
        start_date = datetime.utcnow() - timedelta(days=days)

        obligations = (
            db.query(Obligation).filter(Obligation.created_at >= start_date).all()
        )

        total_obligations = len(obligations)

        completed = (
            db.query(Obligation)
            .filter(
                Obligation.created_at >= start_date,
                Obligation.completed == True,
            )
            .count()
        )

        pending = (
            db.query(Obligation)
            .filter(
                Obligation.created_at >= start_date,
                Obligation.completed == False,
            )
            .count()
        )

        overdue = (
            db.query(Obligation)
            .filter(
                Obligation.created_at >= start_date,
                Obligation.completed == False,
                Obligation.due_date < datetime.utcnow(),
            )
            .count()
        )

        high_priority = (
            db.query(Obligation)
            .filter(
                Obligation.created_at >= start_date,
                Obligation.priority == "High",
            )
            .count()
        )

        medium_priority = (
            db.query(Obligation)
            .filter(
                Obligation.created_at >= start_date,
                Obligation.priority == "Medium",
            )
            .count()
        )

        low_priority = (
            db.query(Obligation)
            .filter(
                Obligation.created_at >= start_date,
                Obligation.priority == "Low",
            )
            .count()
        )

        completion_rate = 0

        if total_obligations:
            completion_rate = round(
                (completed / total_obligations) * 100,
                2,
            )

        average_completion_days = 0

        completed_obligations = [o for o in obligations if o.completed_date]

        if completed_obligations:
            total_days = sum(
                (o.completed_date - o.created_at).days for o in completed_obligations
            )

            average_completion_days = round(
                total_days / len(completed_obligations),
                2,
            )

        return {
            "period": f"Last {days} Days",
            "total_obligations": total_obligations,
            "completed": completed,
            "pending": pending,
            "overdue": overdue,
            "completion_rate": completion_rate,
            "high_priority": high_priority,
            "medium_priority": medium_priority,
            "low_priority": low_priority,
            "average_completion_days": average_completion_days,
        }

    @staticmethod
    def renewal_report(db: Session, days: int):
        start_date = datetime.utcnow() - timedelta(days=days)

        renewals = db.query(Renewal).filter(Renewal.renewal_date >= start_date).all()

        total_renewals = len(renewals)

        completed = (
            db.query(Renewal)
            .filter(
                Renewal.renewal_date >= start_date,
                Renewal.status == "Completed",
            )
            .count()
        )

        pending = (
            db.query(Renewal)
            .filter(
                Renewal.renewal_date >= start_date,
                Renewal.status == "Pending",
            )
            .count()
        )

        failed = (
            db.query(Renewal)
            .filter(
                Renewal.renewal_date >= start_date,
                Renewal.status == "Failed",
            )
            .count()
        )

        upcoming = (
            db.query(Renewal)
            .filter(
                Renewal.new_expiry_date >= datetime.utcnow(),
                Renewal.new_expiry_date <= datetime.utcnow() + timedelta(days=30),
            )
            .count()
        )

        completed_percentage = 0

        if total_renewals:
            completed_percentage = round(
                (completed / total_renewals) * 100,
                2,
            )

        average_extension_days = 0

        if renewals:
            total_days = sum(
                (r.new_expiry_date - r.old_expiry_date).days for r in renewals
            )

            average_extension_days = round(
                total_days / len(renewals),
                2,
            )

        return {
            "period": f"Last {days} Days",
            "total_renewals": total_renewals,
            "completed": completed,
            "pending": pending,
            "failed": failed,
            "upcoming_expiry": upcoming,
            "completion_percentage": completed_percentage,
            "average_extension_days": average_extension_days,
        }

    @staticmethod
    def audit_report(db: Session, days: int):
        start_date = datetime.utcnow() - timedelta(days=days)

        logs = db.query(AuditLog).filter(AuditLog.created_at >= start_date).all()

        total_logs = len(logs)

        successful_actions = (
            db.query(AuditLog)
            .filter(AuditLog.created_at >= start_date, AuditLog.status == "success")
            .count()
        )

        failed_actions = (
            db.query(AuditLog)
            .filter(AuditLog.created_at >= start_date, AuditLog.status == "Failed")
            .count()
        )

        unique_users = (
            db.query(func.count(func.distinct(AuditLog.user_id)))
            .filter(AuditLog.created_at >= start_date)
            .scalar()
        ) or 0

        unique_modules = (
            db.query(func.count(func.distinct(AuditLog.module)))
            .filter(AuditLog.created_at >= start_date)
            .scalar()
        ) or 0

        success_rate = 0

        if total_logs:
            success_rate = round((successful_actions / total_logs) * 100, 2)

        return {
            "period": f"Last {days} Days",
            "total_logs": total_logs,
            "successful_actions": successful_actions,
            "failed_actions": failed_actions,
            "unique_users": unique_users,
            "unique_modules": unique_modules,
            "success_rate": success_rate,
        }

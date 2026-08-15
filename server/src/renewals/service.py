from datetime import date, datetime

from src.audit.service import create_audit_log

from .models import Renewal
from .repository import RenewalRepository


class RenewalService:

    def __init__(self):
        self.repo = RenewalRepository()

    def get_all(self, db):
        return self.repo.get_all(db)

    def create(self, db, data):
        payload = data.dict() if hasattr(data, "dict") else data.model_dump()
        renewal = Renewal(**payload)
        created_renewal = self.repo.create(db, renewal)

        create_audit_log(
            db=db,
            user_id=None,
            event_type="CREATE",
            action="Renewal Created",
            module="Renewal Dashboard",
            description=(
                f"Created renewal: {created_renewal.contract_name} "
                f"(ID: {created_renewal.id}, "
                f"status: {created_renewal.status}, "
                f"approval: {created_renewal.approval_status})"
            ),
        )

        return created_renewal

    def _days_until(self, target_date):
        if not target_date:
            return None
        if isinstance(target_date, str):
            target_date = datetime.fromisoformat(target_date).date()
        return (target_date - date.today()).days

    def dashboard(self, db):
        renewals = self.repo.get_all(db)
        total_contracts = len(renewals)

        expiring30 = 0
        expiring60 = 0
        expiring90 = 0
        reminders = 0
        contracts_payload = []

        for renewal in renewals:
            days_left = self._days_until(getattr(renewal, "expiry_date", None))
            if days_left is None:
                continue

            if 0 <= days_left <= 30:
                expiring30 += 1
            elif 31 <= days_left <= 60:
                expiring60 += 1
            elif 61 <= days_left <= 90:
                expiring90 += 1

            if days_left <= 60:
                reminders += 1

            contracts_payload.append(
                {
                    "id": renewal.id,
                    "contract_name": renewal.contract_name,
                    "vendor": renewal.vendor,
                    "status": renewal.status or "Upcoming",
                    "approval_status": renewal.approval_status,
                    "contract_value": renewal.contract_value,
                    "confidence": renewal.confidence,
                    "recommendation": renewal.recommendation,
                    "expiry_date": renewal.expiry_date.isoformat() if renewal.expiry_date else None,
                    "renewal_date": renewal.renewal_date.isoformat() if renewal.renewal_date else None,
                    "department": renewal.department,
                }
            )

        pipeline = [
            {"month": "Jan", "contracts": 0},
            {"month": "Feb", "contracts": 0},
            {"month": "Mar", "contracts": 0},
            {"month": "Apr", "contracts": 0},
            {"month": "May", "contracts": 0},
            {"month": "Jun", "contracts": 0},
            {"month": "Jul", "contracts": 0},
            {"month": "Aug", "contracts": 0},
            {"month": "Sep", "contracts": 0},
            {"month": "Oct", "contracts": 0},
            {"month": "Nov", "contracts": 0},
            {"month": "Dec", "contracts": 0},
        ]

        for renewal in renewals:
            if renewal.expiry_date:
                month_name = renewal.expiry_date.strftime("%b")
                for entry in pipeline:
                    if entry["month"] == month_name:
                        entry["contracts"] += 1
                        break

        predictions = []
        for renewal in renewals:
            confidence = renewal.confidence or 0
            if confidence >= 85:
                badge = "High Confidence"
            elif confidence >= 70:
                badge = "Recommended"
            else:
                badge = "Moderate"

            predictions.append(
                {
                    "id": f"CTR-{renewal.id:03d}",
                    "title": renewal.recommendation or "Review renewal strategy",
                    "confidence": confidence,
                    "badge": badge,
                }
            )

        if not predictions:
            predictions.append(
                {
                    "id": "AUTO-001",
                    "title": "Add a renewal record to start insights",
                    "confidence": 0,
                    "badge": "Pending",
                }
            )

        return {
            "summary": {
                "expiring30": expiring30,
                "expiring60": expiring60,
                "expiring90": expiring90,
                "autoReminder": reminders,
                "totalContracts": total_contracts,
            },
            "pipeline": pipeline,
            "predictions": predictions,
            "contracts": contracts_payload,
        }


service = RenewalService()

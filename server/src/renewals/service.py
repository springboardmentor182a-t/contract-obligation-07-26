from datetime import date, datetime
from sqlalchemy.orm import Session
from .models import Renewal
from .repository import RenewalRepository

class RenewalService:

    def __init__(self):
        self.repo = RenewalRepository()

    def get_all(self, db: Session):
        return self.repo.get_all(db)

    def create(self, db: Session, data):
        payload = data.dict() if hasattr(data, "dict") else data.model_dump()
        renewal = Renewal(**payload)
        return self.repo.create(db, renewal)

    def _days_until(self, target_date):
        if not target_date:
            return None
        if isinstance(target_date, str):
            target_date = datetime.fromisoformat(target_date).date()
        return (target_date - date.today()).days

    def dashboard(self, db: Session):
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
                days_left = 0

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
                    "contract_name": getattr(renewal, "contract_name", "N/A"),
                    "vendor": getattr(renewal, "vendor", "N/A"),
                    "status": getattr(renewal, "status", None) or "Upcoming",
                    "approval_status": getattr(renewal, "approval_status", "Pending"),
                    "contract_value": getattr(renewal, "contract_value", "N/A"),
                    "confidence": getattr(renewal, "confidence", 80),
                    "recommendation": getattr(renewal, "recommendation", "Review terms"),
                    "expiry_date": renewal.expiry_date.isoformat() if getattr(renewal, "expiry_date", None) else None,
                    "renewal_date": renewal.renewal_date.isoformat() if getattr(renewal, "renewal_date", None) else None,
                    "department": getattr(renewal, "department", "General"),
                    "auto_renew": getattr(renewal, "auto_renew", False),
                    "days_left": days_left,
                    "risk_score": getattr(renewal, "risk_score", "Low"),
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
            expiry = getattr(renewal, "expiry_date", None)
            if expiry:
                month_name = expiry.strftime("%b")
                for entry in pipeline:
                    if entry["month"] == month_name:
                        entry["contracts"] += 1
                        break

        predictions = []
        for renewal in renewals:
            confidence = getattr(renewal, "confidence", None) or 80
            if confidence >= 85:
                badge = "High Confidence"
            elif confidence >= 70:
                badge = "Recommended"
            else:
                badge = "Moderate"

            predictions.append(
                {
                    "id": f"CTR-{renewal.id:03d}",
                    "title": getattr(renewal, "recommendation", None) or "Review renewal strategy",
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
            "metrics": {
                "total_contracts": total_contracts,
                "expiring_30_days": expiring30,
                "expiring_60_days": expiring60,
                "expiring_90_days": expiring90,
                "reminders_sent": reminders,
            },
            "contracts": contracts_payload,
            "pipeline": pipeline,
            "predictions": predictions,
        }

service = RenewalService()
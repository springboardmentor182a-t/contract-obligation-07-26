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
                    "vendor": getattr(renewal, "vendor", "N/A"),
                    "contract_value": getattr(renewal, "contract_value", "N/A"),
                    "expiry_date": str(getattr(renewal, "expiry_date", "N/A")),
                    "auto_renew": getattr(renewal, "auto_renew", False),
                    "days_left": days_left,
                    "risk_score": getattr(renewal, "risk_score", "Low"),
                    "status": getattr(renewal, "status", "Active"),
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
        }

service = RenewalService()
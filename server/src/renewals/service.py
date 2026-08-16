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
        from src.contract_repository.models import Contract
        
        contracts = db.query(Contract).all()
        total_contracts = len(contracts)

        expiring30 = 0
        expiring60 = 0
        expiring90 = 0
        reminders = 0
        contracts_payload = []

        for contract in contracts:
            days_left = self._days_until(getattr(contract, "end_date", None))
            if days_left is None:
                continue

            # Identify expiring contracts
            if 0 <= days_left <= 30:
                expiring30 += 1
            elif 31 <= days_left <= 60:
                expiring60 += 1
            elif 61 <= days_left <= 90:
                expiring90 += 1

            if days_left <= 60:
                reminders += 1

            # Determine confidence based on risk_level
            confidence = 50
            if contract.risk_level == "High":
                confidence = 88
            elif contract.risk_level == "Medium":
                confidence = 72
            elif contract.risk_level == "Low":
                confidence = 35

            contracts_payload.append(
                {
                    "id": contract.id,
                    "contract_name": contract.contract_name,
                    "vendor": contract.vendor,
                    "status": contract.status or "Upcoming",
                    "approval_status": "Pending" if contract.status == "Action Needed" else "Approved",
                    "contract_value": contract.contract_value,
                    "confidence": confidence,
                    "recommendation": "Review renewal strategy based on risk",
                    "expiry_date": contract.end_date.isoformat() if contract.end_date else None,
                    "renewal_date": None,
                    "department": contract.department,
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

        for contract in contracts:
            if contract.end_date:
                month_name = contract.end_date.strftime("%b")
                for entry in pipeline:
                    if entry["month"] == month_name:
                        entry["contracts"] += 1
                        break

        predictions = []
        for contract in contracts:
            if not contract.end_date:
                continue
            
            days_left = self._days_until(contract.end_date)
            # Generate predictions for contracts expiring within 180 days with high/medium risk
            if 0 <= days_left <= 180 and contract.risk_level in ["High", "Medium"]:
                confidence = 88 if contract.risk_level == "High" else 72
                
                if confidence >= 85:
                    badge = "High Confidence"
                elif confidence >= 70:
                    badge = "Recommended"
                else:
                    badge = "Moderate"

                predictions.append(
                    {
                        "id": f"CTR-{contract.id:03d}",
                        "title": f"Review {contract.contract_name} renewal strategy",
                        "confidence": confidence,
                        "badge": badge,
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

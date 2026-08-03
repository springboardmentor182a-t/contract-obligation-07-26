from datetime import date

from .repository import repository


class ComplianceService:

    def dashboard(self, db):
        contracts = repository.get_contracts(db)
        obligations = repository.get_obligations(db)

        today = date.today()

        summary = {
            "total_contracts": len(contracts),
            "compliant_contracts": 0,
            "high_risk_contracts": 0,
            "overdue_obligations": 0,
            "missing_approvals": 0,
            "missing_documents": 0,
        }

        records = []
        alerts = []

        for contract in contracts:

            # -------------------------
            # Calculate days remaining
            # -------------------------
            days_left = None

            if contract.end_date:
                days_left = (contract.end_date - today).days

            # -------------------------
            # Check uploaded documents
            # -------------------------
            has_documents = len(contract.documents) > 0

            # -------------------------
            # Contract obligations
            # -------------------------
            contract_obligations = [
                o for o in obligations
                if o.contract_id == contract.id
            ]

            overdue = sum(
                1
                for obligation in contract_obligations
                if obligation.due_date < today
                and obligation.status != "Completed"
            )

            # -------------------------
            # Approval Status
            # -------------------------
            approval_status = (
                "Approved"
                if contract.status == "Active"
                else "Pending"
            )

            # -------------------------
            # Risk Level
            # -------------------------
            risk_level = "Low"

            if overdue > 0 or not has_documents:
                risk_level = "High"

            elif days_left is not None and days_left <= 30:
                risk_level = "Medium"

            # -------------------------
            # Compliance Status
            # -------------------------
            compliance_status = (
                "Compliant"
                if risk_level == "Low"
                else "Attention Required"
            )

            # -------------------------
            # Recommendation
            # -------------------------
            recommendation = "No action required."

            if overdue:
                recommendation = "Complete overdue obligations."

            elif not has_documents:
                recommendation = "Upload mandatory contract documents."

            elif approval_status == "Pending":
                recommendation = "Complete contract approval."

            elif days_left is not None and days_left <= 30:
                recommendation = "Review renewal before deadline."

            # -------------------------
            # Update Summary
            # -------------------------
            if compliance_status == "Compliant":
                summary["compliant_contracts"] += 1

            if risk_level == "High":
                summary["high_risk_contracts"] += 1

            if overdue:
                summary["overdue_obligations"] += overdue

            if not has_documents:
                summary["missing_documents"] += 1

            if approval_status == "Pending":
                summary["missing_approvals"] += 1

            # -------------------------
            # Alerts
            # -------------------------
            if risk_level != "Low":
                alerts.append(
                    {
                        "severity": risk_level,
                        "title": contract.contract_name,
                        "message": recommendation,
                    }
                )

            # -------------------------
            # Table Record
            # -------------------------
            records.append(
                {
                    "contract_id": contract.id,
                    "contract_name": contract.contract_name,
                    "vendor": contract.vendor,
                    "risk_level": risk_level,
                    "compliance_status": compliance_status,
                    "approval_status": approval_status,
                    "mandatory_documents": has_documents,
                    "overdue_obligations": overdue,
                    "next_deadline": contract.end_date,
                    "recommendation": recommendation,
                }
            )

        return {
            "summary": summary,
            "records": records,
            "alerts": alerts,
        }


service = ComplianceService()
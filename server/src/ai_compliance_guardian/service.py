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
        priority_tasks = []

        for contract in contracts:

            # ---------------------------------
            # Days Remaining
            # ---------------------------------
            days_left = None

            if contract.end_date:
                days_left = max((contract.end_date - today).days, 0)

            # ---------------------------------
            # Documents
            # ---------------------------------
            has_documents = len(contract.documents) > 0

            # ---------------------------------
            # Contract Obligations
            # ---------------------------------
            contract_obligations = [
                obligation
                for obligation in obligations
                if obligation.contract_id == contract.id
            ]

            overdue = sum(
                1
                for obligation in contract_obligations
                if obligation.due_date < today
                and obligation.status != "Completed"
            )

            # ---------------------------------
            # Approval
            # ---------------------------------
            approval_status = (
                "Approved"
                if contract.status == "Active"
                else "Pending"
            )

            # ---------------------------------
            # Risk Level
            # ---------------------------------
            risk_level = "Low"

            if overdue > 0 or not has_documents:
                risk_level = "High"

            elif days_left is not None and days_left <= 30:
                risk_level = "Medium"

            # ---------------------------------
            # Compliance Status
            # ---------------------------------
            compliance_status = (
                "Compliant"
                if risk_level == "Low"
                else "Attention Required"
            )

            # ---------------------------------
            # Recommendation
            # ---------------------------------
            recommendation = "No action required."

            if not has_documents:
                recommendation = "Missing mandatory contract documents."

            elif overdue > 0:
                recommendation = "Overdue obligations detected."

            elif approval_status == "Pending":
                recommendation = "Approval pending."

            elif days_left is not None and days_left <= 30:
                recommendation = "Renewal approaching."

            # ---------------------------------
            # Summary
            # ---------------------------------
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

            # ---------------------------------
            # Alerts
            # ---------------------------------
            if risk_level != "Low":
                alerts.append(
                    {
                        "severity": risk_level,
                        "title": contract.contract_name,
                        "message": recommendation,
                    }
                )

            # ---------------------------------
            # Priority Calculation
            # ---------------------------------
            priority = "Low"

            if not has_documents:
                priority = "Critical"

            elif overdue > 0:
                priority = "High"

            elif approval_status == "Pending":
                priority = "High"

            elif days_left is not None and days_left <= 15:
                priority = "Medium"

            # Only show actionable tasks
            if priority != "Low":
                priority_tasks.append(
                    {
                        "contract_id": contract.id,
                        "contract_name": contract.contract_name,
                        "vendor": contract.vendor,
                        "priority": priority,
                        "reason": recommendation,
                        "days_left": days_left,
                        "deadline": contract.end_date,
                    }
                )

            # ---------------------------------
            # Compliance Table
            # ---------------------------------
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

        # ---------------------------------
        # Sort Priority Tasks
        # ---------------------------------
        priority_order = {
            "Critical": 0,
            "High": 1,
            "Medium": 2,
        }

        priority_tasks.sort(
            key=lambda task: (
                priority_order.get(task["priority"], 3),
                task["days_left"]
                if task["days_left"] is not None
                else 9999,
            )
        )

        return {
            "summary": summary,
            "priority_tasks": priority_tasks,
            "records": records,
            "alerts": alerts,
        }


service = ComplianceService()
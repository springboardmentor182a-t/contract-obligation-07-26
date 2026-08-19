import json
import os
from datetime import date
from typing import Literal

from fastapi import HTTPException, status
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from src.ai_compliance_guardian.service import service as compliance_service
from src.contract_repository.models import Contract
from src.database.models import ObligationModel
from src.renewals.models import Renewal

from .prompts import CONTRACT_INSIGHTS_PROMPT
from .schemas import (
    AIInsights,
    ComplianceSummary,
    ContractInsightsResponse,
    ContractSummary,
    ObligationSummary,
    RenewalSummary,
    ScoreBreakdown,
    ScoreFactor,
)


class GeminiInsightsResult(BaseModel):
    overall_assessment: str = Field(min_length=1, max_length=800)
    key_findings: list[str] = Field(min_length=1, max_length=5)
    recommended_actions: list[str] = Field(min_length=1, max_length=5)


class InsightsService:
    MODEL_NAME = "gemini-3.6-flash"
    COMPLETED_STATUSES = {"completed", "complete", "done"}

    @staticmethod
    def _normalize(value: str | None) -> str:
        return (value or "").strip().lower().replace("_", " ")

    @classmethod
    def _summarize_obligations(
        cls,
        obligations: list[ObligationModel],
        today: date,
    ) -> ObligationSummary:
        completed = 0
        overdue = 0

        for obligation in obligations:
            normalized_status = cls._normalize(obligation.status)

            if normalized_status in cls.COMPLETED_STATUSES:
                completed += 1
                continue

            is_overdue = normalized_status == "overdue" or (
                obligation.due_date is not None
                and obligation.due_date < today
            )

            if is_overdue:
                overdue += 1

        pending = len(obligations) - completed - overdue

        return ObligationSummary(
            total=len(obligations),
            completed=completed,
            pending=max(pending, 0),
            overdue=overdue,
        )

    @staticmethod
    def _get_compliance_summary(
        db: Session,
        contract_id: int,
    ) -> tuple[ComplianceSummary, str]:
        dashboard = compliance_service.dashboard(db)
        record = next(
            (
                item
                for item in dashboard.get("records", [])
                if item.get("contract_id") == contract_id
            ),
            None,
        )

        limitation = (
            "A contract-specific compliance percentage and control results "
            "are unavailable because compliance controls are not linked to "
            "contract_id."
        )

        if record is None:
            return (
                ComplianceSummary(
                    status="Unavailable",
                    approval_status="Unavailable",
                    documents_available=False,
                    signals=[
                        "No contract-specific Compliance Guardian record is available."
                    ],
                    limitation=limitation,
                ),
                "Unknown",
            )

        signals = []

        if record.get("mandatory_documents"):
            signals.append("Contract documents are available for review.")
        else:
            signals.append("No contract documents are available for review.")

        approval_status = record.get("approval_status") or "Unavailable"
        signals.append(f"Approval status: {approval_status}.")

        overdue = int(record.get("overdue_obligations") or 0)
        if overdue:
            signals.append(
                f"{overdue} overdue contract obligation"
                f"{'s' if overdue != 1 else ''} require attention."
            )
        else:
            signals.append("No overdue contract obligations were detected.")

        recommendation = record.get("recommendation")
        if recommendation:
            signals.append(recommendation)

        return (
            ComplianceSummary(
                status=record.get("compliance_status") or "Unavailable",
                approval_status=approval_status,
                documents_available=bool(record.get("mandatory_documents")),
                signals=signals,
                limitation=limitation,
            ),
            record.get("risk_level") or "Unknown",
        )

    @classmethod
    def _score_contract(
        cls,
        contract: Contract,
        renewal: Renewal | None,
        renewal_summary: RenewalSummary,
        obligation_summary: ObligationSummary,
        obligations: list[ObligationModel],
        compliance: ComplianceSummary,
    ) -> tuple[int, Literal["Low", "Medium", "High"], ScoreBreakdown]:
        factors: list[ScoreFactor] = []

        stored_risk = cls._normalize(contract.risk_level)
        risk_penalties = {
            "low": 0,
            "medium": 10,
            "high": 20,
            "critical": 30,
        }
        stored_risk_penalty = risk_penalties.get(stored_risk, 5)
        factors.append(
            ScoreFactor(
                factor="Stored contract risk",
                detail=f"Contract risk is {contract.risk_level or 'Unknown'}.",
                penalty=stored_risk_penalty,
            )
        )

        contract_status = cls._normalize(contract.status)
        if contract_status in {"expired", "terminated", "cancelled"}:
            status_penalty = 25
        elif contract_status in {"draft", "pending", "pending review"}:
            status_penalty = 5
        elif contract_status in {"expiring", "expiring soon"}:
            status_penalty = 5
        elif contract_status in {"active", "approved", "renewed"}:
            status_penalty = 0
        else:
            status_penalty = 5

        factors.append(
            ScoreFactor(
                factor="Contract status",
                detail=f"Contract status is {contract.status or 'Unknown'}.",
                penalty=status_penalty,
            )
        )

        days_remaining = renewal_summary.days_remaining
        if days_remaining < 0:
            timing_penalty = 25
            timing_detail = f"End date passed {abs(days_remaining)} days ago."
        elif days_remaining <= 30:
            timing_penalty = 15
            timing_detail = f"{days_remaining} days remain until the end date."
        elif days_remaining <= 60:
            timing_penalty = 10
            timing_detail = f"{days_remaining} days remain until the end date."
        elif days_remaining <= 90:
            timing_penalty = 5
            timing_detail = f"{days_remaining} days remain until the end date."
        else:
            timing_penalty = 0
            timing_detail = f"{days_remaining} days remain until the end date."

        factors.append(
            ScoreFactor(
                factor="Renewal timing",
                detail=timing_detail,
                penalty=timing_penalty,
            )
        )

        if renewal is None:
            factors.append(
                ScoreFactor(
                    factor="Linked renewal record",
                    detail=(
                        "No renewal record is linked by contract_id; no "
                        "penalty was applied for missing linkage."
                    ),
                    penalty=0,
                )
            )
        else:
            renewal_status = cls._normalize(renewal.status)
            renewal_penalty = (
                10
                if renewal_status in {"action needed", "overdue", "expired"}
                else 5
                if renewal_status in {"pending", "expiring soon"}
                else 0
            )
            factors.append(
                ScoreFactor(
                    factor="Renewal status",
                    detail=f"Linked renewal status is {renewal.status or 'Unknown'}.",
                    penalty=renewal_penalty,
                )
            )

            approval_status = cls._normalize(renewal.approval_status)
            approval_penalty = (
                5
                if approval_status
                in {"pending", "pending review", "in negotiation"}
                else 0
            )
            factors.append(
                ScoreFactor(
                    factor="Renewal approval",
                    detail=(
                        "Linked renewal approval is "
                        f"{renewal.approval_status or 'Unknown'}."
                    ),
                    penalty=approval_penalty,
                )
            )

        overdue_penalty = min(obligation_summary.overdue * 10, 30)
        factors.append(
            ScoreFactor(
                factor="Overdue obligations",
                detail=(
                    f"{obligation_summary.overdue} of "
                    f"{obligation_summary.total} obligations are overdue."
                ),
                penalty=overdue_penalty,
            )
        )

        pending_penalty = min(obligation_summary.pending * 3, 15)
        factors.append(
            ScoreFactor(
                factor="Pending obligations",
                detail=(
                    f"{obligation_summary.pending} of "
                    f"{obligation_summary.total} obligations are pending."
                ),
                penalty=pending_penalty,
            )
        )

        unresolved_high_priority = sum(
            1
            for obligation in obligations
            if cls._normalize(obligation.priority) in {"high", "critical"}
            and cls._normalize(obligation.status) not in cls.COMPLETED_STATUSES
        )
        priority_penalty = min(unresolved_high_priority * 2, 10)
        factors.append(
            ScoreFactor(
                factor="High-priority obligations",
                detail=(
                    f"{unresolved_high_priority} unresolved high-priority "
                    "obligations were found."
                ),
                penalty=priority_penalty,
            )
        )

        document_penalty = 0 if compliance.documents_available else 10
        factors.append(
            ScoreFactor(
                factor="Compliance documentation",
                detail=(
                    "Contract documents are available."
                    if compliance.documents_available
                    else "No contract documents are available."
                ),
                penalty=document_penalty,
            )
        )

        compliance_approval_penalty = (
            5
            if cls._normalize(compliance.approval_status) == "pending"
            else 0
        )
        factors.append(
            ScoreFactor(
                factor="Contract approval",
                detail=f"Approval status is {compliance.approval_status}.",
                penalty=compliance_approval_penalty,
            )
        )

        total_penalty = sum(factor.penalty for factor in factors)
        health_score = max(0, 100 - total_penalty)

        if health_score >= 80:
            risk_level: Literal["Low", "Medium", "High"] = "Low"
        elif health_score >= 60:
            risk_level = "Medium"
        else:
            risk_level = "High"

        return (
            health_score,
            risk_level,
            ScoreBreakdown(
                total_penalty=total_penalty,
                factors=factors,
            ),
        )

    @staticmethod
    def _unavailable_ai_content() -> AIInsights:
        message = "AI analysis is temporarily unavailable."
        return AIInsights(
            overall_assessment=message,
            key_findings=[],
            recommended_actions=[],
            available=False,
            error_message=message,
        )

    @classmethod
    def _generate_ai_content(cls, payload: dict) -> AIInsights:
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            return cls._unavailable_ai_content()

        prompt = (
            f"{CONTRACT_INSIGHTS_PROMPT}\n\n"
            "Structured contract data:\n"
            f"{json.dumps(payload, indent=2)}"
        )

        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model=cls.MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GeminiInsightsResult,
                    temperature=0.2,
                ),
            )

            if not response.text:
                raise ValueError("Gemini returned an empty response.")

            result = GeminiInsightsResult.model_validate_json(response.text)

        except Exception:
            return cls._unavailable_ai_content()

        return AIInsights(
            **result.model_dump(),
            available=True,
            error_message=None,
        )

    @classmethod
    def get_insights(
        cls,
        db: Session,
        contract_id: int,
    ) -> ContractInsightsResponse:
        contract = (
            db.query(Contract)
            .filter(Contract.id == contract_id)
            .first()
        )

        if contract is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contract not found.",
            )

        renewal = (
            db.query(Renewal)
            .filter(Renewal.contract_id == contract_id)
            .order_by(Renewal.renewal_date.desc())
            .first()
        )

        obligations = (
            db.query(ObligationModel)
            .filter(ObligationModel.contract_id == contract_id)
            .all()
        )

        today = date.today()
        obligation_summary = cls._summarize_obligations(obligations, today)
        compliance, compliance_risk = cls._get_compliance_summary(
            db,
            contract_id,
        )

        end_date = (
            renewal.expiry_date
            if renewal is not None and renewal.expiry_date is not None
            else contract.end_date
        )
        renewal_summary = RenewalSummary(
            linked=renewal is not None,
            renewal_id=renewal.id if renewal is not None else None,
            status=(
                renewal.status or "Status unavailable"
                if renewal is not None
                else "No linked renewal record"
            ),
            approval_status=(
                renewal.approval_status if renewal is not None else None
            ),
            renewal_date=(
                renewal.renewal_date if renewal is not None else None
            ),
            end_date=end_date,
            days_remaining=(end_date - today).days,
            source="renewal" if renewal is not None else "contract",
        )

        health_score, risk_level, score_breakdown = cls._score_contract(
            contract=contract,
            renewal=renewal,
            renewal_summary=renewal_summary,
            obligation_summary=obligation_summary,
            obligations=obligations,
            compliance=compliance,
        )

        contract_summary = ContractSummary(
            id=contract.id,
            contract_name=contract.contract_name,
            contract_number=contract.contract_number,
            vendor=contract.vendor,
            department=contract.department,
            contract_type=contract.contract_type,
            contract_value=contract.contract_value,
            status=contract.status or "Unknown",
            stored_risk_level=contract.risk_level or "Unknown",
            owner=contract.owner,
            renewal_type=contract.renewal_type or "Unknown",
            description=contract.description,
            start_date=contract.start_date,
            end_date=contract.end_date,
        )

        obligation_records = [
            {
                "title": obligation.title,
                "status": obligation.status,
                "priority": obligation.priority,
                "due_date": (
                    obligation.due_date.isoformat()
                    if obligation.due_date
                    else None
                ),
            }
            for obligation in obligations
        ]

        structured_payload = {
            "contract": contract_summary.model_dump(mode="json"),
            "health_score": health_score,
            "risk_level": risk_level,
            "renewal": renewal_summary.model_dump(mode="json"),
            "obligation_summary": obligation_summary.model_dump(mode="json"),
            "obligations": obligation_records,
            "compliance": compliance.model_dump(mode="json"),
            "compliance_guardian_risk": compliance_risk,
            "score_breakdown": score_breakdown.model_dump(mode="json"),
        }
        ai_content = cls._generate_ai_content(structured_payload)

        return ContractInsightsResponse(
            contract=contract_summary,
            health_score=health_score,
            risk_level=risk_level,
            renewal=renewal_summary,
            obligations=obligation_summary,
            compliance=compliance,
            score_breakdown=score_breakdown,
            ai=ai_content,
        )

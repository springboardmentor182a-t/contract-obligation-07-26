import json
import os
from datetime import date
from typing import Literal

from fastapi import HTTPException, status
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from src.contract_repository.models import Contract
from src.database.models import ObligationModel
from src.renewals.models import Renewal

from .prompts import RENEWAL_STRATEGY_PROMPT
from .schemas import RenewalStrategyResponse


class GeminiStrategyResult(BaseModel):
    recommendation: Literal[
        "Renew",
        "Renegotiate",
        "Extend",
        "Review",
        "Terminate",
    ]

    confidence: int = Field(ge=0, le=100)

    risk_level: Literal[
        "Low",
        "Medium",
        "High",
        "Critical",
        "Unknown",
    ]

    reasons: list[str] = Field(
        min_length=1,
        max_length=5,
    )

    alternative_strategy: str | None = None
    suggested_action: str


class RenewalAIService:
    MODEL_NAME = "gemini-3.6-flash"

    @staticmethod
    def generate_strategy(
        db: Session,
        contract_id: int,
    ) -> RenewalStrategyResponse:
        # Fetch the contract from the shared database.
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

        # Fetch the latest renewal record connected to the contract.
        renewal = (
            db.query(Renewal)
            .filter(Renewal.contract_id == contract_id)
            .order_by(Renewal.renewal_date.desc())
            .first()
        )

        # Fetch obligations connected to the contract.
        obligations = (
            db.query(ObligationModel)
            .filter(
                ObligationModel.contract_id == contract_id
            )
            .all()
        )

        today = date.today()

        # Use renewal expiry date when available.
        # Otherwise, use the original contract end date.
        expiry_date = (
            renewal.expiry_date
            if renewal and renewal.expiry_date
            else contract.end_date
        )

        days_to_expiry = (
            (expiry_date - today).days
            if expiry_date
            else None
        )

        pending_statuses = {
            "pending",
            "in progress",
            "in_progress",
        }

        completed_statuses = {
            "completed",
            "complete",
            "done",
        }

        pending_obligations = sum(
            1
            for obligation in obligations
            if (obligation.status or "").strip().lower()
            in pending_statuses
        )

        overdue_obligations = sum(
            1
            for obligation in obligations
            if (
                obligation.due_date is not None
                and obligation.due_date < today
                and (obligation.status or "")
                .strip()
                .lower()
                not in completed_statuses
            )
        )

        completed_obligations = sum(
            1
            for obligation in obligations
            if (obligation.status or "").strip().lower()
            in completed_statuses
        )

        # Only structured database values are sent to Gemini.
        contract_summary = {
            "contract_id": contract.id,
            "contract_name": contract.contract_name,
            "vendor": contract.vendor,
            "department": contract.department,
            "contract_type": contract.contract_type,
            "contract_value": contract.contract_value,
            "contract_status": contract.status,
            "existing_risk_level": contract.risk_level,
            "renewal_type": contract.renewal_type,
            "start_date": (
                contract.start_date.isoformat()
                if contract.start_date
                else None
            ),
            "end_date": (
                contract.end_date.isoformat()
                if contract.end_date
                else None
            ),
            "renewal_date": (
                renewal.renewal_date.isoformat()
                if renewal and renewal.renewal_date
                else None
            ),
            "expiry_date": (
                expiry_date.isoformat()
                if expiry_date
                else None
            ),
            "days_to_expiry": days_to_expiry,
            "renewal_status": (
                renewal.status
                if renewal
                else None
            ),
            "approval_status": (
                renewal.approval_status
                if renewal
                else None
            ),
            "total_obligations": len(obligations),
            "pending_obligations": pending_obligations,
            "overdue_obligations": overdue_obligations,
            "completed_obligations": completed_obligations,
        }

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="GEMINI_API_KEY is not configured.",
            )

        prompt = (
            f"{RENEWAL_STRATEGY_PROMPT}\n\n"
            "Live contract data:\n"
            f"{json.dumps(contract_summary, indent=2)}"
        )

        try:
            client = genai.Client(api_key=api_key)

            response = client.models.generate_content(
                model=RenewalAIService.MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GeminiStrategyResult,
                    temperature=0.2,
                ),
            )

            if not response.text:
                raise ValueError(
                    "Gemini returned an empty response."
                )

            ai_result = (
                GeminiStrategyResult.model_validate_json(
                    response.text
                )
            )

        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Unable to generate the AI renewal strategy."
                ),
            ) from error

        return RenewalStrategyResponse(
            contract_id=contract.id,
            renewal_id=renewal.id if renewal else None,
            recommendation=ai_result.recommendation,
            confidence=ai_result.confidence,
            risk_level=ai_result.risk_level,
            reasons=ai_result.reasons,
            alternative_strategy=(
                ai_result.alternative_strategy
            ),
            suggested_action=ai_result.suggested_action,
            days_to_expiry=days_to_expiry,
            pending_obligations=pending_obligations,
            overdue_obligations=overdue_obligations,
        )
import json
import logging
import math
import os
import re
import time
from datetime import date
from threading import Lock
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.contract_repository.models import Contract
from src.database.core import get_db
from src.database.models import ComplianceControl, ObligationModel
from src.renewals.models import Renewal


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/assurance",
    tags=["Contract Assurance"],
)

CACHE_SECONDS = 300
MODEL_NAME = "gemini-3.6-flash"

_cache_lock = Lock()
_cached_response: tuple[float, "AssuranceResponse"] | None = None


class AssuranceResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    status: str
    summary: str
    monitored: bool


class GeminiAssuranceResult(BaseModel):
    score: float
    status: Literal[
        "Strong",
        "Healthy",
        "Watch",
        "At Risk",
        "Critical",
        "Insufficient Data",
    ]
    summary: str = Field(min_length=1, max_length=240)


ASSURANCE_PROMPT = """
You assess the overall ContractIQ contract portfolio using aggregate data only.
Apply this fixed rubric exactly. Start at 100 and subtract:
- 12 * expired contracts / total contracts
- 10 * high-risk contracts / total contracts
- 5 * contracts expiring within 90 days / total contracts
- 3 * other non-active contracts / total contracts
- 20 * overdue obligations / total obligations
- 10 * pending obligations / total obligations
- 20 * failed or rejected controls / total controls
- 5 * warning or pending controls / total controls
- 12 * critical renewals / total renewal records
- 3 * upcoming renewals / total renewal records

When a denominator is zero, that term contributes zero. Round to the nearest
whole number and clamp the score to 0 through 100. If total contracts is zero,
the score must be 0 and the status must be "Insufficient Data".

Use these status bands:
- 90-100: Strong
- 75-89: Healthy
- 60-74: Watch
- 40-59: At Risk
- 0-39: Critical

Return JSON only with exactly score, status, and summary. The summary must be a
single concise sentence about the portfolio. Do not include counts,
percentages, identifiers, names, vendors, values, users, or details about any
individual contract or obligation. Do not invent data or add recommendations.
""".strip()


def _normalize(value: str | None) -> str:
    normalized = (value or "").strip().lower()
    normalized = normalized.replace("_", " ").replace("-", " ")
    return " ".join(normalized.split())


def _rate(count: int, total: int) -> float:
    return count / total if total else 0.0


def _clamp_score(value: float) -> int:
    if not math.isfinite(value):
        raise ValueError("Assurance score must be finite.")
    clamped = max(0.0, min(100.0, value))
    return int(math.floor(clamped + 0.5))


def _status_for_score(score: int, has_contracts: bool) -> str:
    if not has_contracts:
        return "Insufficient Data"
    if score >= 90:
        return "Strong"
    if score >= 75:
        return "Healthy"
    if score >= 60:
        return "Watch"
    if score >= 40:
        return "At Risk"
    return "Critical"


def _collect_metrics(db: Session) -> dict[str, dict[str, int]]:
    today = date.today()

    contract_rows = db.execute(
        select(Contract.status, Contract.risk_level, Contract.end_date)
    ).all()

    active_contracts = 0
    expired_contracts = 0
    high_risk_contracts = 0
    expiring_contracts = 0
    other_non_active_contracts = 0

    active_statuses = {"active", "approved", "renewed"}
    expired_statuses = {"expired", "terminated", "cancelled", "canceled"}

    for status_value, risk_value, end_date in contract_rows:
        contract_status = _normalize(status_value)
        risk_level = _normalize(risk_value)
        is_expired = (
            contract_status in expired_statuses
            or (end_date is not None and end_date < today)
        )
        is_active = not is_expired and contract_status in active_statuses

        if is_expired:
            expired_contracts += 1
        elif is_active:
            active_contracts += 1
        else:
            other_non_active_contracts += 1

        if risk_level in {"high", "critical"}:
            high_risk_contracts += 1

        if not is_expired and end_date is not None:
            days_remaining = (end_date - today).days
            if 0 <= days_remaining <= 90:
                expiring_contracts += 1

    obligation_rows = db.execute(
        select(ObligationModel.status, ObligationModel.due_date)
    ).all()

    completed_obligations = 0
    overdue_obligations = 0
    completed_statuses = {"completed", "complete", "done"}

    for status_value, due_date in obligation_rows:
        obligation_status = _normalize(status_value)

        if obligation_status in completed_statuses:
            completed_obligations += 1
            continue

        if (
            obligation_status == "overdue"
            or (due_date is not None and due_date < today)
        ):
            overdue_obligations += 1

    pending_obligations = max(
        len(obligation_rows) - completed_obligations - overdue_obligations,
        0,
    )

    control_rows = db.execute(select(ComplianceControl.status)).scalars().all()

    passed_controls = 0
    failed_controls = 0
    unresolved_controls = 0

    for status_value in control_rows:
        control_status = _normalize(status_value)
        if control_status in {"passed", "verified", "approved"}:
            passed_controls += 1
        elif control_status in {"failed", "rejected"}:
            failed_controls += 1
        else:
            unresolved_controls += 1

    renewal_rows = db.execute(
        select(Renewal.status, Renewal.approval_status, Renewal.expiry_date)
    ).all()

    critical_renewals = 0
    upcoming_renewals = 0
    critical_statuses = {
        "action needed",
        "critical",
        "expired",
        "needs action",
        "overdue",
    }
    critical_approval_statuses = {"declined", "rejected"}

    for status_value, approval_value, expiry_date in renewal_rows:
        renewal_status = _normalize(status_value)
        approval_status = _normalize(approval_value)
        days_remaining = (
            (expiry_date - today).days
            if expiry_date is not None
            else None
        )

        is_critical = (
            renewal_status in critical_statuses
            or approval_status in critical_approval_statuses
            or (days_remaining is not None and days_remaining <= 30)
        )

        if is_critical:
            critical_renewals += 1
        elif days_remaining is not None and 31 <= days_remaining <= 90:
            upcoming_renewals += 1

    return {
        "contracts": {
            "total": len(contract_rows),
            "active": active_contracts,
            "expired": expired_contracts,
            "high_risk": high_risk_contracts,
            "expiring_soon": expiring_contracts,
            "other_non_active": other_non_active_contracts,
        },
        "obligations": {
            "total": len(obligation_rows),
            "completed": completed_obligations,
            "pending": pending_obligations,
            "overdue": overdue_obligations,
        },
        "compliance": {
            "total": len(control_rows),
            "passed": passed_controls,
            "pending": unresolved_controls,
            "failed": failed_controls,
        },
        "renewals": {
            "total": len(renewal_rows),
            "upcoming": upcoming_renewals,
            "critical": critical_renewals,
        },
    }


def _calculate_score(
    metrics: dict[str, dict[str, int]],
) -> tuple[int, str, dict[str, float]]:
    contracts = metrics["contracts"]
    obligations = metrics["obligations"]
    compliance = metrics["compliance"]
    renewals = metrics["renewals"]

    if contracts["total"] == 0:
        return 0, "Insufficient Data", {
            "contracts": 0.0,
            "obligations": 0.0,
            "compliance": 0.0,
            "renewals": 0.0,
        }

    contract_penalty = (
        12 * _rate(contracts["expired"], contracts["total"])
        + 10 * _rate(contracts["high_risk"], contracts["total"])
        + 5 * _rate(contracts["expiring_soon"], contracts["total"])
        + 3 * _rate(contracts["other_non_active"], contracts["total"])
    )
    obligation_penalty = (
        20 * _rate(obligations["overdue"], obligations["total"])
        + 10 * _rate(obligations["pending"], obligations["total"])
    )
    compliance_penalty = (
        20 * _rate(compliance["failed"], compliance["total"])
        + 5 * _rate(compliance["pending"], compliance["total"])
    )
    renewal_penalty = (
        12 * _rate(renewals["critical"], renewals["total"])
        + 3 * _rate(renewals["upcoming"], renewals["total"])
    )

    penalties = {
        "contracts": contract_penalty,
        "obligations": obligation_penalty,
        "compliance": compliance_penalty,
        "renewals": renewal_penalty,
    }
    score = _clamp_score(100 - sum(penalties.values()))
    return score, _status_for_score(score, has_contracts=True), penalties


def _fallback_summary(
    status: str,
    penalties: dict[str, float],
) -> str:
    if status == "Insufficient Data":
        return "No contract portfolio data is currently available for assurance analysis."

    attention_labels = {
        "contracts": "contract risk and expiry",
        "obligations": "obligations",
        "compliance": "compliance",
        "renewals": "renewals",
    }
    attention = [
        attention_labels[area]
        for area, penalty in penalties.items()
        if penalty > 0
    ]

    if not attention:
        return "Portfolio assurance is strong across all currently monitored areas."

    if len(attention) == 1:
        areas = attention[0]
    else:
        areas = f"{', '.join(attention[:-1])} and {attention[-1]}"

    return f"Portfolio assurance is {status.lower()}, with attention indicated in {areas}."


def _generate_with_gemini(
    metrics: dict[str, dict[str, int]],
    deterministic_score: int,
    deterministic_status: str,
) -> AssuranceResponse | None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    prompt = (
        f"{ASSURANCE_PROMPT}\n\n"
        "Current aggregate portfolio data:\n"
        f"{json.dumps(metrics, sort_keys=True)}"
    )

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeminiAssuranceResult,
                temperature=0,
            ),
        )

        if not response.text:
            raise ValueError("Gemini returned no assurance result.")

        result = GeminiAssuranceResult.model_validate_json(response.text)
        score = _clamp_score(result.score)
        expected_status = _status_for_score(
            score,
            has_contracts=metrics["contracts"]["total"] > 0,
        )
        summary = result.summary.strip()

        if score != deterministic_score:
            raise ValueError("Gemini score did not match the fixed rubric.")
        if result.status != expected_status or result.status != deterministic_status:
            raise ValueError("Gemini status did not match the validated score.")
        if re.search(r"\d|%", summary):
            raise ValueError("Gemini summary contained disallowed aggregate values.")

        return AssuranceResponse(
            score=score,
            status=deterministic_status,
            summary=summary,
            monitored=True,
        )
    except Exception:
        logger.warning(
            "Gemini assurance generation failed; using deterministic fallback."
        )
        return None


def _refresh_assurance(db: Session) -> AssuranceResponse:
    metrics = _collect_metrics(db)
    score, status, penalties = _calculate_score(metrics)

    if metrics["contracts"]["total"] > 0:
        ai_response = _generate_with_gemini(metrics, score, status)
        if ai_response is not None:
            return ai_response

    return AssuranceResponse(
        score=score,
        status=status,
        summary=_fallback_summary(status, penalties),
        monitored=True,
    )


@router.get("", response_model=AssuranceResponse)
def get_assurance(db: Session = Depends(get_db)) -> AssuranceResponse:
    global _cached_response

    now = time.monotonic()
    cached = _cached_response
    if cached is not None and now - cached[0] < CACHE_SECONDS:
        return cached[1]

    with _cache_lock:
        now = time.monotonic()
        cached = _cached_response
        if cached is not None and now - cached[0] < CACHE_SECONDS:
            return cached[1]

        try:
            response = _refresh_assurance(db)
        except Exception:
            logger.error("Unable to refresh the contract assurance score.")
            raise HTTPException(
                status_code=503,
                detail="Contract assurance is temporarily unavailable.",
            ) from None

        _cached_response = (time.monotonic(), response)
        return response

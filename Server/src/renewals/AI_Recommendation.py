import json, re
from datetime import datetime

import torch
from sqlalchemy.orm import Session

from src.chatbot.model import model, tokenizer
from src.entities.renewal import (
    Renewal,
    RenewalApproval,
    RenewalReminder,
    RenewalHistory,
    RenewalStatus,
    ApprovalStatus,
)


def _clean_ai_response(text: str) -> str:
    if not text:
        return ""

    text = re.sub(
        r"<think>.*?</think>",
        "",
        text,
        flags=re.DOTALL | re.IGNORECASE,
    )

    text = re.sub(r"```json", "", text, flags=re.IGNORECASE)
    text = re.sub(r"```", "", text)
    return text.strip()


def _extract_json(text: str):
    text = _clean_ai_response(text)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return None
    return None


def _fallback_recommendation(
    days_until_expiry: int,
    notice_period_days: int,
    status: str,
    auto_renew: bool,
    pending_approvals: int,
    rejected_approvals: int,
):
    reasons = []
    if status == RenewalStatus.EXPIRED.value:
        recommendation = "Do Not Renew"
        risk_level = "High"
        action = "Review the expired contract immediately."
        reasons.append("The contract has already expired.")

    elif rejected_approvals > 0:
        recommendation = "Review Before Renewal"
        risk_level = "High"
        action = "Resolve rejected approval steps before proceeding."
        reasons.append(f"{rejected_approvals} approval step(s) have been rejected.")

    elif pending_approvals > 0:
        recommendation = "Review Before Renewal"
        risk_level = "Medium"
        action = "Complete pending approval steps."
        reasons.append(f"{pending_approvals} approval step(s) are still pending.")

    elif days_until_expiry <= notice_period_days:
        recommendation = "Renew Soon"
        risk_level = "High"
        action = "Start the renewal process immediately."
        reasons.append("The contract is within its configured notice period.")

    elif days_until_expiry <= 30:
        recommendation = "Renew Soon"
        risk_level = "Medium"
        action = "Begin renewal preparation."
        reasons.append("The contract expires within 30 days.")

    elif auto_renew:
        recommendation = "Auto-Renew"
        risk_level = "Low"
        action = "Verify auto-renewal terms and continue monitoring."
        reasons.append("Auto-renewal is enabled for this renewal.")

    else:
        recommendation = "Renew"
        risk_level = "Low"
        action = "Continue monitoring and prepare renewal before the notice period."
        reasons.append(
            "The contract is active and not currently within the urgent renewal window."
        )

    return {
        "recommendation": recommendation,
        "confidence": 70,
        "risk_level": risk_level,
        "reasons": reasons,
        "action": action,
    }


def generate_renewal_recommendation(
    db: Session,
    renewal_id: int,
):
    renewal = db.query(Renewal).filter(Renewal.renewal_id == renewal_id).first()
    if not renewal:
        return None

    now = datetime.utcnow()
    days_until_expiry = (renewal.expiry_date - now).days
    approvals = (
        db.query(RenewalApproval).filter(RenewalApproval.renewal_id == renewal_id).all()
    )

    reminders = (
        db.query(RenewalReminder).filter(RenewalReminder.renewal_id == renewal_id).all()
    )

    history = (
        db.query(RenewalHistory)
        .filter(RenewalHistory.renewal_id == renewal_id)
        .order_by(RenewalHistory.created_at.desc())
        .limit(10)
        .all()
    )

    pending_approvals = sum(
        1
        for approval in approvals
        if (
            approval.status.value
            if hasattr(approval.status, "value")
            else approval.status
        )
        == ApprovalStatus.PENDING.value
    )

    rejected_approvals = sum(
        1
        for approval in approvals
        if (
            approval.status.value
            if hasattr(approval.status, "value")
            else approval.status
        )
        == ApprovalStatus.REJECTED.value
    )

    approved_approvals = sum(
        1
        for approval in approvals
        if (
            approval.status.value
            if hasattr(approval.status, "value")
            else approval.status
        )
        == ApprovalStatus.APPROVED.value
    )

    sent_reminders = sum(1 for reminder in reminders if reminder.sent)

    status = (
        renewal.status.value if hasattr(renewal.status, "value") else renewal.status
    )

    history_data = [
        {
            "action": item.action,
            "performed_by": item.performed_by,
            "details": item.details,
        }
        for item in history
    ]

    renewal_context = {
        "contract_name": renewal.contract_name,
        "contract_id": renewal.contract_id_ref,
        "category": renewal.category,
        "vendor": renewal.vendor,
        "owner": renewal.owner,
        "expiry_date": renewal.expiry_date.isoformat(),
        "days_until_expiry": days_until_expiry,
        "notice_period_days": renewal.notice_period_days,
        "contract_value": renewal.value,
        "status": status,
        "auto_renew": renewal.auto_renew,
        "approval_summary": {
            "total": len(approvals),
            "pending": pending_approvals,
            "approved": approved_approvals,
            "rejected": rejected_approvals,
        },
        "reminder_summary": {
            "total": len(reminders),
            "sent": sent_reminders,
            "pending": len(reminders) - sent_reminders,
        },
        "recent_history": history_data,
    }

    if model is None or tokenizer is None:
        print("Siree Not")
        result = _fallback_recommendation(
            days_until_expiry=days_until_expiry,
            notice_period_days=renewal.notice_period_days,
            status=status,
            auto_renew=renewal.auto_renew,
            pending_approvals=pending_approvals,
            rejected_approvals=rejected_approvals,
        )

        result["renewal_id"] = renewal_id
        result["contract_name"] = renewal.contract_name
        result["days_until_expiry"] = days_until_expiry
        result["ai_generated"] = False
        return result

    system_prompt = """
        You are ContractIQ AI, an AI assistant for contract renewal decisions.

        Analyze ONLY the renewal information provided by the user.

        You must recommend one of these exact options:

        1. "Renew"
        2. "Renew Soon"
        3. "Review Before Renewal"
        4. "Auto-Renew"
        5. "Do Not Renew"

        Rules:

        - If the contract is expired, strongly consider "Do Not Renew".
        - If there are rejected approvals, prefer "Review Before Renewal".
        - If important approvals are pending, prefer "Review Before Renewal".
        - If the contract is inside its notice period, prefer "Renew Soon".
        - If auto-renew is enabled and there are no major issues, "Auto-Renew" may be appropriate.
        - Do not invent vendor performance, financial risk, compliance violations,
        customer satisfaction, or other information that is not provided.
        - Use only the supplied renewal data.

        Return ONLY valid JSON.

        Required JSON structure:

        {
        "recommendation": "Renew",
        "confidence": 85,
        "risk_level": "Low",
        "reasons": [
            "reason 1",
            "reason 2"
        ],
        "action": "Recommended next action"
        }

        Allowed risk_level values:

        "Low"
        "Medium"
        "High"

        Do not include markdown.
        Do not include <think>.
        Do not explain your reasoning outside the JSON.
        """

    user_prompt = f"""
        Renewal Information:

        {json.dumps(renewal_context, indent=2, default=str)}

        Generate the renewal recommendation.
        """

    messages = [
        {
            "role": "system",
            "content": system_prompt.strip(),
        },
        {
            "role": "user",
            "content": user_prompt.strip(),
        },
    ]

    try:
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        inputs = tokenizer(
            text,
            return_tensors="pt",
        ).to(model.device)

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=32,
                do_sample=False,
                temperature=0.0,
                repetition_penalty=1.1,
                eos_token_id=tokenizer.eos_token_id,
                pad_token_id=tokenizer.eos_token_id,
            )

        generated = outputs[0][inputs["input_ids"].shape[1] :]

        raw_answer = tokenizer.decode(
            generated,
            skip_special_tokens=True,
        )

        result = _extract_json(raw_answer)
        
        if not result:
            result = _fallback_recommendation(
                days_until_expiry=days_until_expiry,
                notice_period_days=renewal.notice_period_days,
                status=status,
                auto_renew=renewal.auto_renew,
                pending_approvals=pending_approvals,
                rejected_approvals=rejected_approvals,
            )
            ai_generated = False
        else:
            ai_generated = True
            recommendation = result.get("recommendation")

            allowed_recommendations = {
                "Renew",
                "Renew Soon",
                "Review Before Renewal",
                "Auto-Renew",
                "Do Not Renew",
            }

            if recommendation not in allowed_recommendations:
                fallback = _fallback_recommendation(
                    days_until_expiry=days_until_expiry,
                    notice_period_days=renewal.notice_period_days,
                    status=status,
                    auto_renew=renewal.auto_renew,
                    pending_approvals=pending_approvals,
                    rejected_approvals=rejected_approvals,
                )

                result = fallback
                ai_generated = False
        confidence = result.get("confidence", 70)

        try:
            confidence = int(confidence)
        except (TypeError, ValueError):
            confidence = 70

        confidence = max(0, min(100, confidence))

        risk_level = result.get("risk_level", "Medium")

        if risk_level not in {"Low", "Medium", "High"}:
            risk_level = "Medium"

        reasons = result.get("reasons", [])

        if not isinstance(reasons, list):
            reasons = [str(reasons)]

        reasons = [str(reason).strip() for reason in reasons if str(reason).strip()]

        action = str(
            result.get(
                "action",
                "Review the recommendation before taking action.",
            )
        ).strip()

        return {
            "renewal_id": renewal_id,
            "contract_name": renewal.contract_name,
            "recommendation": result.get(
                "recommendation",
                "Review Before Renewal",
            ),
            "confidence": confidence,
            "risk_level": risk_level,
            "reasons": reasons,
            "action": action,
            "days_until_expiry": days_until_expiry,
            "ai_generated": ai_generated,
        }

    except Exception as e:
        fallback = _fallback_recommendation(
            days_until_expiry=days_until_expiry,
            notice_period_days=renewal.notice_period_days,
            status=status,
            auto_renew=renewal.auto_renew,
            pending_approvals=pending_approvals,
            rejected_approvals=rejected_approvals,
        )

        fallback.update(
            {
                "renewal_id": renewal_id,
                "contract_name": renewal.contract_name,
                "days_until_expiry": days_until_expiry,
                "ai_generated": False,
                "ai_error": str(e),
            }
        )
        return fallback

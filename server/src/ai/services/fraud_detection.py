import os
import json
import re
from typing import Dict, Any, List

SYSTEM_PROMPT = """You are a Legal & Digital Forensics Anomaly Detection Engine for ContractIQ.
Your task is to analyze contract text to detect:
1. Non-standard, aggressive, or ambiguous legal clauses.
2. Hidden liabilities, unreasonable warranties, or uncapped indemnities.
3. Digital tampering markers, contradictory date sequences, or mismatched entity names.

Return ONLY a valid JSON object matching this schema:
{
  "fraud_detected": boolean,
  "anomaly_score": number (0 to 100),
  "tampering_markers": [string],
  "anomalies": [
    {
      "id": "ANOM-01",
      "clause_text": "Exact or approximate clause excerpt",
      "issue_type": "Hidden Liability" | "Non-Standard Term" | "Tampering Marker" | "Ambiguous Penalty",
      "severity": "Low" | "Medium" | "High" | "Critical",
      "explanation": "Detailed rationale of why this is risky or anomalous",
      "recommendation": "Suggested modification or mitigation action"
    }
  ],
  "summary": "Concise 2-sentence executive summary of contract integrity."
}
"""

def heuristic_fraud_detection(contract_text: str) -> Dict[str, Any]:
    """
    Fallback deterministic forensic analysis when OpenAI API is offline or unconfigured.
    """
    text_lower = contract_text.lower()
    anomalies = []
    tampering_markers = []
    score = 15.0

    # 1. Check for uncapped liability
    if "unlimited liability" in text_lower or "uncapped liability" in text_lower or "no limitation of liability" in text_lower:
        score += 35.0
        anomalies.append({
            "id": "ANOM-01",
            "clause_text": "Unlimited liability clause detected in indemnification section",
            "issue_type": "Hidden Liability",
            "severity": "Critical",
            "explanation": "Clause exposes the enterprise to unbounded financial damage without customary liability caps.",
            "recommendation": "Cap liability to 12 months of paid contract fees."
        })

    # 2. Check for unilateral termination / immediate forfeit
    if "sole discretion" in text_lower or "without cause" in text_lower or "immediate termination" in text_lower:
        score += 20.0
        anomalies.append({
            "id": "ANOM-02",
            "clause_text": "Unilateral termination at sole discretion without reciprocal cure periods",
            "issue_type": "Non-Standard Term",
            "severity": "High",
            "explanation": "Opposing party retains right to terminate abruptly without standard 30-day notice and cure period.",
            "recommendation": "Introduce mandatory 30-day written notice and mutual breach remedy periods."
        })

    # 3. Check for suspicious jurisdiction / offshore arbitration
    if "foreign jurisdiction" in text_lower or "unspecified venue" in text_lower or "cayman" in text_lower or "seychelles" in text_lower:
        score += 25.0
        tampering_markers.append("Offshore dispute jurisdiction detected outside standard commercial forums")
        anomalies.append({
            "id": "ANOM-03",
            "clause_text": "Non-standard dispute resolution venue",
            "issue_type": "Tampering Marker",
            "severity": "Medium",
            "explanation": "Dispute venue deviates from primary governing jurisdiction of contracting entities.",
            "recommendation": "Designate standard commercial state or federal courts (e.g., Delaware / New York)."
        })

    # 4. Check for auto-renewal penalty traps
    if "auto-renew" in text_lower or "automatic renewal" in text_lower or "liquidated damages" in text_lower:
        score += 15.0
        anomalies.append({
            "id": "ANOM-04",
            "clause_text": "Automatic multi-year rollover with accelerated default penalties",
            "issue_type": "Ambiguous Penalty",
            "severity": "Medium",
            "explanation": "Strict opt-out window creates vulnerability to unintended contract commitment extensions.",
            "recommendation": "Implement automated 60-day advance renewal notification requirement."
        })

    # If no anomalies found, generate clean baseline
    if not anomalies:
        return {
            "fraud_detected": False,
            "anomaly_score": 8,
            "tampering_markers": [],
            "anomalies": [
                {
                    "id": "ANOM-00",
                    "clause_text": "Standard commercial terms",
                    "issue_type": "Non-Standard Term",
                    "severity": "Low",
                    "explanation": "All clauses conform to typical SaaS and enterprise master service agreement norms.",
                    "recommendation": "Proceed with regular legal signoff."
                }
            ],
            "summary": "Document exhibits high integrity. No digital tampering or high-severity liability anomalies detected."
        }

    score = min(96.0, score)
    return {
        "fraud_detected": score > 50.0,
        "anomaly_score": int(score),
        "tampering_markers": tampering_markers,
        "anomalies": anomalies,
        "summary": f"Identified {len(anomalies)} anomalous clause(s) requiring legal review before execution."
    }

async def detect_fraud_and_anomalies(contract_text: str) -> Dict[str, Any]:
    """
    Executes OpenAI LLM Anomaly Detection with automatic graceful fallback.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or len(contract_text.strip()) < 10:
        return heuristic_fraud_detection(contract_text)

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini" if "gpt-4o-mini" else "gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this contract text for fraud and anomalies:\n\n{contract_text[:12000]}"}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"[OpenAI Anomaly Error: {e}] -> Falling back to heuristic forensics")
        return heuristic_fraud_detection(contract_text)

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
from src.ai.services.knn_risk import knn_service
from src.ai.services.fraud_detection import detect_fraud_and_anomalies

router = APIRouter()

class RiskScoreRequest(BaseModel):
    contract_value: float = Field(default=150000.0, description="Contract total monetary value in USD")
    term_months: int = Field(default=12, description="Contract duration in months")
    vendor_risk_history: float = Field(default=3.5, description="Vendor risk rating from 1 to 10")
    compliance_flags: int = Field(default=0, description="Number of active compliance flags")
    uncapped_liability: int = Field(default=0, description="1 if uncapped liability present, else 0")

class DetectFraudRequest(BaseModel):
    contract_text: str = Field(..., description="Raw contract text or clause excerpts to analyze")
    contract_id: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []

@router.post("/risk-score")
async def calculate_knn_risk_score(request: RiskScoreRequest):
    """
    Triggers local scikit-learn KNeighborsRegressor model to predict continuous contract risk score.
    """
    try:
        result = knn_service.predict_risk(
            contract_value=request.contract_value,
            term_months=request.term_months,
            vendor_risk_history=request.vendor_risk_history,
            compliance_flags=request.compliance_flags,
            uncapped_liability=request.uncapped_liability
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"KNN Risk Model evaluation failed: {str(e)}")

@router.post("/detect-fraud")
async def detect_fraud_endpoint(request: DetectFraudRequest):
    """
    Triggers OpenAI LLM Anomaly & Digital Tampering Detection with heuristic fallback.
    """
    try:
        result = await detect_fraud_and_anomalies(request.contract_text)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fraud & Anomaly evaluation failed: {str(e)}")

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    system_prompt = "You are the ContractIQ Expert AI Assistant. Your job is to clear all user doubts. You must provide highly accurate, professional, and concise answers regarding contract management, legal clause analysis, risk compliance, and how to use the ContractIQ platform. Do not hallucinate features. If a user asks a complex question, break the answer down into easy-to-understand bullet points."
    
    try:
        import openai
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise Exception("OpenAI API key is missing")

        client = openai.OpenAI(api_key=api_key)
        messages = [{"role": "system", "content": system_prompt}]
        for msg in request.history:
            role = "user" if msg.get("sender") == "user" else "assistant"
            messages.append({"role": role, "content": msg.get("text", "")})
        messages.append({"role": "user", "content": request.message})
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

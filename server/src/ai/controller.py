from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    system_prompt = "You are a Legal & Contract Management Assistant for ContractIQ. You help users manage contracts, obligations, and legal queries."
    
    try:
        import openai
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
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
    except Exception:
        pass # Fallback to mock if openai is not installed or API key is missing

    # Mock response
    user_msg = request.message.lower()
    reply = "Hello! I am the ContractIQ AI Assistant. How can I help you with your contracts today?"
    if "contract" in user_msg:
        reply = "I can assist you with contract review and tracking. Could you provide a contract ID or specify what you need?"
    elif "obligation" in user_msg:
        reply = "You can view and manage all pending obligations in the Obligation Tracker. Should I highlight the high-priority ones?"
        
    return {"reply": reply}

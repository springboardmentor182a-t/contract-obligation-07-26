import json
import os
from datetime import date
from fastapi import HTTPException, status
from google import genai
from sqlalchemy.orm import Session
from src.contract_repository.models import Contract
from src.database.models import ObligationModel, User
from src.chatbot.schemas import ChatRequest, ChatResponse

class ChatbotService:
    MODEL_NAME = "gemini-3.6-flash"
    
    SYSTEM_PROMPT = """You are a helpful and knowledgeable legal assistant for the ContractIQ application.
    Your goal is to answer user questions about their contracts accurately based ONLY on the data provided below.
    If the information is not available in the context, politely state that you do not have that information.
    Provide concise and clear answers. Do not expose internal IDs unless specifically asked.
    """

    @staticmethod
    def chat(db: Session, request: ChatRequest, current_user: User | None) -> ChatResponse:
        context = {}
        if request.contract_id is not None:
            if current_user is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You must be logged in to access specific contracts.")
                
            contract = db.query(Contract).filter(Contract.id == request.contract_id).first()
            
            if not contract:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found.")
                
            # Data Isolation Check
            if current_user.role != "Administrator" and contract.organization_id != current_user.organization_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this contract.")

            obligations = db.query(ObligationModel).filter(ObligationModel.contract_id == request.contract_id).all()
            
            # Build context
            context = {
                "type": "Specific Contract Context",
                "contract_name": contract.contract_name,
                "contract_number": contract.contract_number,
                "vendor": contract.vendor,
                "department": contract.department,
                "contract_type": contract.contract_type,
                "status": contract.status,
                "start_date": contract.start_date.isoformat() if contract.start_date else None,
                "end_date": contract.end_date.isoformat() if contract.end_date else None,
                "contract_value": contract.contract_value,
                "risk_level": contract.risk_level,
                "description": contract.description,
                "obligations": [
                    {
                        "title": ob.title,
                        "description": ob.description,
                        "priority": ob.priority,
                        "status": ob.status,
                        "due_date": ob.due_date.isoformat() if ob.due_date else None
                    }
                    for ob in obligations
                ]
            }
        else:
            if current_user is None:
                # Public Guest Context
                context = {
                    "type": "Public Guest Context",
                    "user_type": "Guest (Not logged in)",
                    "summary": "You are assisting a guest user who is not logged in. You can explain what ContractIQ does: it is a smart contract lifecycle and obligation management platform. Tell them they can log in or sign up to manage their contracts, track obligations, and view compliance reports."
                }
            else:
                # Global Context for Authenticated User
                if current_user.role == "Administrator":
                    contracts = db.query(Contract).all()
                else:
                    contracts = db.query(Contract).filter(Contract.organization_id == current_user.organization_id).all()
                
                active_count = sum(1 for c in contracts if c.status == "Active")
                total_value = sum(c.contract_value for c in contracts if c.contract_value)
                
                context = {
                    "type": "Global Workspace Context",
                    "user_name": current_user.full_name,
                    "user_role": current_user.role,
                    "total_contracts": len(contracts),
                    "active_contracts": active_count,
                    "total_contract_value": total_value,
                    "summary": "This is a global view of the user's workspace. Provide general assistance, summarize their active contracts count, and help them navigate."
                }

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI Service is currently unavailable.")
            
        prompt = (
            f"{ChatbotService.SYSTEM_PROMPT}\n\n"
            f"Context:\n{json.dumps(context, indent=2)}\n\n"
            f"User Question: {request.message}"
        )
        
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model=ChatbotService.MODEL_NAME,
                contents=prompt
            )
            
            if not response.text:
                raise ValueError("AI returned empty response")
                
            return ChatResponse(
                contract_id=request.contract_id,
                response=response.text
            )
        except Exception as e:
            import traceback
            with open("chatbot_error_log.txt", "w") as f:
                traceback.print_exc(file=f)
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI Service failed to generate a response.") from e

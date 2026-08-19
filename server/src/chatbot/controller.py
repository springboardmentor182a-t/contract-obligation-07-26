from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import User
from src.auth.dependencies import get_current_user, get_current_user_optional
from src.chatbot.schemas import ChatRequest, ChatResponse
from src.chatbot.service import ChatbotService

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("/chat", response_model=ChatResponse)
def chat_with_bot(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional)
):
    return ChatbotService.chat(db, request, current_user)

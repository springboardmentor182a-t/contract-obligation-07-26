from fastapi import APIRouter, HTTPException, status
from .models import UserLogin, Token
from .service import authenticate_user

router = APIRouter()

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(credentials: UserLogin):
    token = authenticate_user(credentials)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )
    return token
from fastapi import APIRouter

from src.auth.controller import router as auth_router
from src.todos.controller import router as todos_router
from src.users.controller import router as users_router
from src.renewals.controller import router as renewals_router
api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(todos_router, prefix="/todos", tags=["Todos"])
api_router.include_router(renewals_router, prefix="/renewals", tags=["Renewals"])

from fastapi import APIRouter
from .auth.controller import router as auth_router
from .users.controller import router as users_router
from .todos.controller import router as todos_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(users_router, prefix="/users", tags=["Users"])
router.include_router(todos_router, prefix="/todos", tags=["Todos"])
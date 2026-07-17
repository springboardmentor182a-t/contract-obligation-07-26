from fastapi import APIRouter
<<<<<<< HEAD

from src.auth.controller import router as auth_router
from src.todos.controller import router as todos_router
from src.users.controller import router as users_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(todos_router)
api_router.include_router(users_router)
=======
from src.auth.controller import router as auth_router
from src.contracts.controller import router as contracts_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
>>>>>>> e4b4e4e0c29f6c8156d879c7524be11fe270caa9

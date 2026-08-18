from fastapi import APIRouter

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/")
def list_todos():
    return []

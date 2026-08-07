from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import Todo

router = APIRouter(prefix="/todos", tags=["todos"])

@router.get("/")
def list_todos(db: Session = Depends(get_db)):
    todos = db.query(Todo).all()
    return [{"id": t.id, "title": t.title, "done": t.done} for t in todos]

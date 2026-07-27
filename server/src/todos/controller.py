from fastapi import APIRouter, status
from typing import List
from .models import TodoCreate, TodoResponse
from .service import create_todo, get_todos

router = APIRouter()

@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def add_todo(todo: TodoCreate):
    return create_todo(todo)

@router.get("/", response_model=List[TodoResponse])
def read_todos():
    return get_todos()
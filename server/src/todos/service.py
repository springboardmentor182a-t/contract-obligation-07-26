from typing import List
from .models import TodoCreate, TodoResponse

def create_todo(todo_data: TodoCreate) -> TodoResponse:
    return TodoResponse(
        id=1,
        title=todo_data.title,
        description=todo_data.description,
        completed=todo_data.completed
    )

def get_todos() -> List[TodoResponse]:
    return [
        TodoResponse(id=1, title="Review Master Services Agreement", completed=False),
        TodoResponse(id=2, title="Complete Insurance Renewal", completed=True)
    ]
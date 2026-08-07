from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.tasks.models import TaskCreate, TaskUpdate, TaskResponse
from src.tasks.service import (
    get_all_tasks,
    get_task_by_id,
    create_task,
    update_task,
    delete_task,
)

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/", response_model=list[TaskResponse])
def read_tasks(db: Session = Depends(get_db)):
    return get_all_tasks(db)


@router.get("/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = get_task_by_id(task_id, db)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.post("/", response_model=TaskResponse)
def add_task(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(task, db)


@router.put("/{task_id}", response_model=TaskResponse)
def edit_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    updated_task = update_task(task_id, task, db)

    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_task


@router.delete("/{task_id}")
def remove_task(task_id: int, db: Session = Depends(get_db)):
    deleted = delete_task(task_id, db)

    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")

    return deleted
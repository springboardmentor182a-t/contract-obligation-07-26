from sqlalchemy.orm import Session

from src.tasks.models import TaskModel, TaskCreate, TaskUpdate


def get_all_tasks(db: Session):
    return db.query(TaskModel).all()


def get_task_by_id(task_id: int, db: Session):
    return db.query(TaskModel).filter(TaskModel.id == task_id).first()


def create_task(task: TaskCreate, db: Session):
    db_task = TaskModel(
    title=task.title,
    description=task.description,
    contract_id=task.contract_id,

    related_contract=task.related_contract,
    company=task.company,

    assigned_to=task.assigned_to,
    due_date=task.due_date,

    priority=task.priority,
    status=task.status,

    progress=task.progress,
)

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


def update_task(task_id: int, task: TaskUpdate, db: Session):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()

    if not db_task:
        return None

    db_task.title = task.title
    db_task.description = task.description
    db_task.contract_id = task.contract_id

    db_task.related_contract = task.related_contract
    db_task.company = task.company

    db_task.assigned_to = task.assigned_to
    db_task.due_date = task.due_date
    db_task.priority = task.priority
    db_task.status = task.status

    db_task.progress = task.progress

    db.commit()
    db.refresh(db_task)

    return db_task


def delete_task(task_id: int, db: Session):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()

    if not db_task:
        return None

    db.delete(db_task)
    db.commit()

    return {"message": "Task deleted successfully"}
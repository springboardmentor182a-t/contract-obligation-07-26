from pydantic import BaseModel
from typing import Optional

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoResponse(TodoBase):
    id: int

    class Config:
<<<<<<< HEAD
        from_attributes = True
=======
        from_attributes = True
>>>>>>> origin/main-group-D

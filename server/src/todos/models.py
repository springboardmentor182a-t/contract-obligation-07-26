from pydantic import BaseModel


class TodoResponse(BaseModel):
    id: int
    title: str
    done: bool = False

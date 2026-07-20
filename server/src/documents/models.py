from pydantic import BaseModel


class DocumentCreate(BaseModel):
    file_name: str
    file_path: str
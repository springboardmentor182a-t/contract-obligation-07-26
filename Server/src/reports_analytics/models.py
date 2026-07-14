from pydantic import BaseModel
from datetime import datetime


class ReportRequest(BaseModel):
    days: int
    report_name: str
    type: str
    format: str
    message: str


class ReportResponse(BaseModel):
    report_id: int
    report_name: str
    report_type: str
    generated_by: str
    file_path: str
    format: str
    create_at: datetime

    class Config:
        from_attributes = True

from datetime import datetime


class Report:
    """Pure domain entity for Report."""

    def __init__(
        self,
        id: int,
        report_name: str,
        report_type: str | None,
        generated_by: int | None,
        generated_at: datetime | None,
        file_path: str | None,
        status: str | None,
    ):
        self.id = id
        self.report_name = report_name
        self.report_type = report_type
        self.generated_by = generated_by
        self.generated_at = generated_at
        self.file_path = file_path
        self.status = status
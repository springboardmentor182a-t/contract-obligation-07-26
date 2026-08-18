from datetime import datetime


class AuditLog:
    """Pure domain entity for Audit Log."""

    def __init__(
        self,
        id: int,
        user_id: int | None,
        action: str,
        module: str | None,
        description: str | None,
        ip_address: str | None,
        created_at: datetime | None,
    ):
        self.id = id
        self.user_id = user_id
        self.action = action
        self.module = module
        self.description = description
        self.ip_address = ip_address
        self.created_at = created_at
from datetime import datetime


class Notification:
    """Pure domain entity for Notification."""

    def __init__(
        self,
        id: int,
        user_id: int,
        title: str,
        message: str,
        notification_type: str | None,
        is_read: bool,
        created_at: datetime | None,
    ):
        self.id = id
        self.user_id = user_id
        self.title = title
        self.message = message
        self.notification_type = notification_type
        self.is_read = is_read
        self.created_at = created_at
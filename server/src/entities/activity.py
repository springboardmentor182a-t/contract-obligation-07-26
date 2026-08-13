from datetime import datetime


class Activity:
    """Pure domain entity for Activity."""

    def __init__(
        self,
        id: int,
        user_id: int | None,
        activity_name: str,
        activity_type: str | None,
        description: str | None,
        created_at: datetime | None,
    ):
        self.id = id
        self.user_id = user_id
        self.activity_name = activity_name
        self.activity_type = activity_type
        self.description = description
        self.created_at = created_at
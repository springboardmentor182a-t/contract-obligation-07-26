from datetime import date, datetime


class Obligation:
    """Pure domain entity for an Obligation."""

    def __init__(
        self,
        id: int,
        contract_id: int,
        obligation_name: str,
        description: str | None,
        obligation_type: str | None,
        assigned_to: int | None,
        due_date: date,
        priority: str,
        status: str,
        completed_at: datetime | None,
    ):
        self.id = id
        self.contract_id = contract_id
        self.obligation_name = obligation_name
        self.description = description
        self.obligation_type = obligation_type
        self.assigned_to = assigned_to
        self.due_date = due_date
        self.priority = priority
        self.status = status
        self.completed_at = completed_at
from datetime import date


class Renewal:
    """Pure domain entity for Renewal."""

    def __init__(
        self,
        id: int,
        contract_id: int,
        renewal_date: date,
        reminder_date: date | None,
        renewal_status: str,
        renewal_type: str | None,
        assigned_to: int | None,
        remarks: str | None,
    ):
        self.id = id
        self.contract_id = contract_id
        self.renewal_date = renewal_date
        self.reminder_date = reminder_date
        self.renewal_status = renewal_status
        self.renewal_type = renewal_type
        self.assigned_to = assigned_to
        self.remarks = remarks
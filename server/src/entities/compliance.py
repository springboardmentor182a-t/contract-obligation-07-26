from datetime import datetime


class Compliance:
    """Pure domain entity for Compliance."""

    def __init__(
        self,
        id: int,
        contract_id: int,
        compliance_type: str | None,
        compliance_status: str | None,
        checked_by: int | None,
        checked_at: datetime | None,
        remarks: str | None,
    ):
        self.id = id
        self.contract_id = contract_id
        self.compliance_type = compliance_type
        self.compliance_status = compliance_status
        self.checked_by = checked_by
        self.checked_at = checked_at
        self.remarks = remarks
from datetime import date


class Contract:
    """Pure domain entity for a Contract."""

    def __init__(
        self,
        id: int,
        title: str,
        description: str | None,
        contract_type: str | None,
        status: str | None,
        start_date: date | None,
        end_date: date | None,
    ):
        self.id = id
        self.title = title
        self.description = description
        self.contract_type = contract_type
        self.status = status
        self.start_date = start_date
        self.end_date = end_date
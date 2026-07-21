class Renewal:
    """Pure domain entity for a Renewal."""

    def __init__(
        self,
        id: int,
        contract: str,
        client: str,
        renewal_date: str,
        renewal_type: str,
        status: str,
    ):
        self.id = id
        self.contract = contract
        self.client = client
        self.renewal_date = renewal_date
        self.renewal_type = renewal_type
        self.status = status
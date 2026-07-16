from datetime import datetime


class ContractVersion:
    """Pure domain entity for Contract Version."""

    def __init__(
        self,
        id: int,
        contract_id: int,
        version_number: int,
        document_url: str,
        uploaded_by: int | None,
        uploaded_at: datetime | None,
        remarks: str | None,
    ):
        self.id = id
        self.contract_id = contract_id
        self.version_number = version_number
        self.document_url = document_url
        self.uploaded_by = uploaded_by
        self.uploaded_at = uploaded_at
        self.remarks = remarks
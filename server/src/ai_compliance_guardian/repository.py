from sqlalchemy import select
from sqlalchemy.orm import joinedload

from src.contract_repository.models import (
    Contract,
    ContractDocument,
)
from src.database.models import ObligationModel


class ComplianceRepository:

    def get_contracts(self, db):
        """
        Fetch all contracts along with their uploaded documents.
        """
        result = db.execute(
            select(Contract).options(
                joinedload(Contract.documents)
            )
        )

        return result.unique().scalars().all()

    def get_obligations(self, db):
        """
        Fetch all obligations.
        """
        result = db.execute(
            select(ObligationModel)
        )

        return result.scalars().all()


repository = ComplianceRepository()
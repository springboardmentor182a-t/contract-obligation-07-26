from sqlalchemy import Column, Integer, String, ForeignKey
from src.database.core import Base


class ContractVersion(Base):

    __tablename__ = "contract_versions"

    id = Column(Integer, primary_key=True, index=True)

    contract_id = Column(Integer, ForeignKey("contracts.id"))

    version = Column(String(20))

    document_path = Column(String(255))
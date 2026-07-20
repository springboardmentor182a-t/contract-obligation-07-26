from pydantic import BaseModel


class ContractCreate(BaseModel):
    title: str
    owner: str
    status: str
    expiry: str


class ContractResponse(ContractCreate):
    id: int

    class Config:
        from_attributes = True
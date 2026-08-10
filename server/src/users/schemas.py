from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional



class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    department: str
    status: str
    lastActive: str

    class Config:
        from_attributes = True


class UserInviteRequest(BaseModel):
    full_name: Optional[str] = ""
    email: EmailStr
    role: str
    department: Optional[str] = ""
    message: Optional[str] = ""



class UserInviteResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    department: str
    status: str
    invitedAt: str

    model_config = ConfigDict(from_attributes=True)

class UserUpdateRequest(BaseModel):
    full_name: str
    email: EmailStr
    role: str
    department: str
    status: str
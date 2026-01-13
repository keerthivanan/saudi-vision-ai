from pydantic import BaseModel, EmailStr
from typing import Optional

class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None

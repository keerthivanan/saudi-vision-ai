from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    provider: str
    image: Optional[str] = None
    provider_id: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    image: Optional[str]
    provider: str
    provider_id: str
    created_at: datetime
    updated_at: datetime
    
    # Monetization
    credits: float
    tier: str

    class Config:
        from_attributes = True

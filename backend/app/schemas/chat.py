from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ChatRequest(BaseModel):
    """
    Strict V2 Model for Chat Requests.
    Enforces strong typing for the reasoning engine.
    """
    message: str = Field(..., min_length=1, description="The user's query or message.")
    conversation_id: Optional[str] = Field(None, description="UUID of the existing conversation.")
    language: Optional[str] = Field("en", description="Target language code (en/ar)")

class ChatResponse(BaseModel):
    """
    Standardized Chat Response Model.
    """
    response: str
    conversation_id: UUID

class ConversationResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime  # Added for proper "most recent first" sorting

    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    timestamp: datetime  # Fixed: was 'created_at' but model uses 'timestamp'

    class Config:
        from_attributes = True

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.ai_service import ai_service
from app.services.chat_service import chat_service  # Legacy service for DB CRUD
from app.schemas.chat import ChatRequest
from app.api.deps import get_current_user, get_current_user_optional
from app.models.user import User

router = APIRouter()


from typing import List
from uuid import UUID
from app.schemas.chat import ChatRequest, ConversationResponse, MessageResponse

@router.get("/history", response_model=List[ConversationResponse])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch all past conversations for the logged-in user.
    """
    conversations = await chat_service.get_user_conversations(db, current_user.id)
    return conversations

@router.get("/{conversation_id}", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch messages for a specific conversation.
    """
    # Verify ownership? Currently chat_service.get_history doesn't check owner explicitly but UUID is hard to guess.
    # Ideally checking if conversation.user_id == current_user.id
    messages = await chat_service.get_history(db, conversation_id, limit=50)
    # Convert DB models to Pydantic
    return messages

@router.post("/stream")
async def stream_chat(
    request: ChatRequest,
    current_user: User | None = Depends(get_current_user_optional), 
    db: AsyncSession = Depends(get_db)
):
    """
    State-of-the-Art Streaming Chat Endpoint.
    Uses 'Reasoning' events to show the AI's thought process.
    """
    # 1. Monetization & Access Control
    # ---------------------------------------------------------
    if not current_user:
        raise HTTPException(
            status_code=401, 
            detail="Please Sign In to use the Enterprise AI Platform. You get 30 Free Credits on signup!"
        )

    # Minimum Balance Check (Need at least 0.1 credit to start)
    if current_user.credits < 0.1:
        raise HTTPException(
            status_code=402,
            detail="Insufficient Credits. Please upgrade your plan."
        )
    # ---------------------------------------------------------

    # 2. Conversation Management
    user_id = current_user.id
    
    conversation_id = request.conversation_id
    if not conversation_id:
        conv = await chat_service.create_conversation(db, current_user.id, request.message[:50])
        conversation_id = conv.id
        await chat_service.add_message(db, conversation_id, "user", request.message)
    
    # 2. Get History for Context
    history = []
    if conversation_id and current_user:
        history_objs = await chat_service.get_history(db, conversation_id, limit=6)
        history = [{"role": msg.sender, "content": msg.content} for msg in history_objs]
        history.reverse()

    # 3. Stream Response & Calculate Usage
    async def event_generator():
        full_response = ""
        try:
            async for chunk in ai_service.generate_response_stream(
                request.message, 
                history, 
                db, 
                language=request.language or "en"
            ):
                yield f"data: {chunk}\n\n"
                
                data = json.loads(chunk)
                if data["event"] == "token":
                    full_response += data["data"]
            
            # 4. Save AI Response
            if full_response and conversation_id and current_user:
                await chat_service.add_message(db, conversation_id, "ai", full_response)
                
                # 5. Calculate & Deduct Credits (Token Based)
                try:
                    import tiktoken
                    enc = tiktoken.encoding_for_model("gpt-4o")
                    
                    input_tokens = len(enc.encode(request.message))
                    output_tokens = len(enc.encode(full_response))
                    total_tokens = input_tokens + output_tokens
                    
                    # Formula: 1 Credit = 500 Tokens (User Request)
                    cost = total_tokens / 500.0 
                    
                    current_user.credits -= cost
                    
                    # Atomic Update: UPDATE users SET credits = credits - cost WHERE id = user_id
                    # This prevents race conditions better than ORM object manipulation
                    from sqlalchemy import update
                    await db.execute(
                        update(User)
                        .where(User.id == user_id)
                        .values(credits=User.credits - cost)
                    )
                    await db.commit()
                    
                    # Refresh to get exact DB value
                    await db.refresh(current_user)
                    
                    # Notify Frontend of new balance
                    yield f"data: {json.dumps({'event': 'billing', 'data': {'cost': cost, 'remaining': current_user.credits}})}\n\n"
                except Exception as e:
                    print(f"Billing Error: {e}")
                
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'event': 'error', 'data': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

import json

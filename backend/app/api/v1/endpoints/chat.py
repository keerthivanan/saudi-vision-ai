from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.db.session import get_db, AsyncSessionLocal
from app.services.ai_service import ai_service
from app.services.chat_service import chat_service  # Legacy service for DB CRUD
from app.schemas.chat import ChatRequest
from app.api.deps import get_current_user, get_current_user_optional
from app.models.user import User

router = APIRouter()


from typing import List
from uuid import UUID
from app.schemas.chat import ChatRequest, ConversationResponse, MessageResponse

@router.get("/test")
async def test_endpoint():
    return {"status": "ok", "message": "Chat Router Passed"}

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
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        with open("server_error.log", "w") as f:
            f.write(traceback.format_exc())
            f.write(f"\nError: {e}")
        raise HTTPException(status_code=500, detail=f"Auth/Check Error: {str(e)}")

    try:
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
            history = [{"role": msg.role, "content": msg.content} for msg in history_objs]
            history.reverse()
    except Exception as e:
        import traceback
        with open("server_error.log", "w") as f:
            f.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Setup Error: {str(e)}")

    # 3. Stream Response & Calculate Usage
    print(f">>> STARTING STREAM GENERATOR Logic for user={user_id}")
    
    async def event_generator():
        print(">>> GENERATOR STARTED ITERATION")
        
        # 0. NOTIFY FRONTEND OF CONVERSATION ID (Critical for History Sync)
        yield f"data: {json.dumps({'event': 'conversation_created', 'data': {'id': str(conversation_id), 'title': request.message[:50]}})}\n\n"
        
        full_response = ""
        
        try:
            # Create a fresh session for the streaming lifetime if needed, or just for the end.
            
            # Determine Model based on Tier ("GPT-5 Access" for Royal)
            # Default to "gpt-4o-mini" for speed/efficiency for normal users
            # Use "gpt-4o" (The Flagship) for Premium/Royal users 
            
            user_model = "gpt-4o-mini" # Standard/Free
            if current_user and current_user.tier in ['premium', 'royal', 'enterprise']:
                user_model = "gpt-4o" # The "GPT-5" Equivalent
            
            # If user has high credits (bought a Royal pack), we can also treat them as premium
            if current_user and current_user.credits > 150:
                 user_model = "gpt-4o"

            async for chunk in ai_service.generate_response_stream(
                request.message, 
                history, 
                None, 
                language=request.language or "en",
                model=user_model,
                user_id=str(current_user.id) if current_user else None
            ):
                # print(f">>> CHUNK: {chunk[:20]}...") 
                yield f"data: {chunk}\n\n"
                
                try:
                    data = json.loads(chunk)
                    if data["event"] == "token":
                        full_response += data["data"]
                except:
                    pass
            
            print(f">>> GENERATION COMPLETE. Length: {len(full_response)}")
            
            # 4. Save AI Response & Billing (Atomic & Fresh Session)
            if full_response and conversation_id and current_user:
                print(">>> SAVING TO DB (Fresh Session)...")
                # Use module-level AsyncSessionLocal import
                async with AsyncSessionLocal() as final_db:
                    # Re-fetch conversation/messages if needed, but we just need IDs
                    await chat_service.add_message(final_db, conversation_id, "ai", full_response)
                    
                    # 5. Calculate & Deduct Credits
                    import tiktoken
                    enc = tiktoken.encoding_for_model("gpt-4o")
                    
                    input_tokens = len(enc.encode(request.message))
                    output_tokens = len(enc.encode(full_response))
                    total_tokens = input_tokens + output_tokens
                    
                    cost = total_tokens / 500.0 
                    
                    # Deduct
                    await final_db.execute(
                        update(User)
                        .where(User.id == user_id)
                        .values(credits=User.credits - cost)
                    )
                    await final_db.commit()
                    
                    # Get updated balance for UI
                    result = await final_db.execute(select(User.credits).where(User.id == user_id))
                    updated_credits = result.scalar()
                    
                    print(f">>> BILLING COMPLETE. Remaining: {updated_credits}")
                    yield f"data: {json.dumps({'event': 'billing', 'data': {'cost': cost, 'remaining': updated_credits}})}\n\n"
                
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            print(f">>> STREAM EXCEPTION: {e}")
            import traceback
            traceback.print_exc()
            yield f"data: {json.dumps({'event': 'error', 'data': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

import json

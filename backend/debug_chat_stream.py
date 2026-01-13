
import asyncio
import sys
import os
import json
from uuid import uuid4

# Setup Path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.ai_service import ai_service
from app.services.chat_service import chat_service
from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select, update

async def debug_stream():
    print("🔬 DEBUGGING CHAT STREAM LOGIC...")
    
    request_message = "What is Vision 2030?"
    # 1. Setup Mock User/Conv
    async with AsyncSessionLocal() as db:
        user = (await db.execute(select(User).filter(User.email == "verifier@saudi.ai"))).scalars().first()
        if not user:
             print("❌ User not found. Run verify script first to create user.")
             return
        user_id = user.id
        
        # Create Conv
        conv = await chat_service.create_conversation(db, user_id, "Debug Stream")
        conversation_id = conv.id
        print(f"✅ Setup: User {user_id}, Conv {conversation_id}")

    # 2. REPLICATE event_generator logic
    print("🚀 Starting Generator...")
    
    full_response = ""
    history = []
    
    try:
        # Create a fresh session for the streaming lifetime if needed, or just for the end.
        
        async for chunk in ai_service.generate_response_stream(
            request_message, 
            history, 
            None, 
            language="en"
        ):
            print(f"   CHUNK: {chunk.strip()[:50]}...")
            
            try:
                data = json.loads(chunk)
                if data["event"] == "token":
                    full_response += data["data"]
            except:
                pass
        
        print(f"✅ Generation Complete. Response Len: {len(full_response)}")
        
        # 4. Save AI Response & Billing (Atomic & Fresh Session)
        if full_response and conversation_id and user_id:
            print("💾 Saving to DB (Fresh Session)...")
            async with AsyncSessionLocal() as final_db:
                # Re-fetch conversation/messages if needed, but we just need IDs
                await chat_service.add_message(final_db, conversation_id, "ai", full_response)
                print("   Saved Message.")
                
                cost = 0.5 
                
                # Deduct
                await final_db.execute(
                    update(User)
                    .where(User.id == user_id)
                    .values(credits=User.credits - cost)
                )
                await final_db.commit()
                print("   Deducted Credits.")
                
                # Get updated balance for UI
                result = await final_db.execute(select(User.credits).where(User.id == user_id))
                updated_credits = result.scalar()
                print(f"   Updated Credits: {updated_credits}")
                
        print("🎉 STREAM LOGIC SUCCESS.")
        
    except Exception as e:
        print(f"❌ STREAM ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_stream())

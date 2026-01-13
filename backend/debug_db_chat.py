import asyncio
import sys
import os
from uuid import uuid4

# Setup Path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import AsyncSessionLocal
from app.services.chat_service import chat_service
from app.models.user import User
from sqlalchemy import select

async def debug_chat_db():
    print("🔬 DEBUGGING CHAT DB OPERATIONS...")
    async with AsyncSessionLocal() as db:
        # 1. Get/Create User
        email = "verifier@saudi.ai"
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        
        if not user:
            print(f"User {email} not found. Creating mock...")
            user = User(
                id=str(uuid4()),
                email=email,
                name="Debug User",
                provider="test",
                provider_id="123",
                credits=10.0
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        print(f"👤 User ID: {user.id} (Type: {type(user.id)})")
        
        # 2. TEST: Create Conversation
        print("2. Creating Conversation...")
        try:
            conv = await chat_service.create_conversation(db, user.id, "Debug Chat Title")
            print(f"✅ Conversation Created: {conv.id}")
        except Exception as e:
            print(f"❌ Create Conversation Failed: {e}")
            import traceback
            traceback.print_exc()
            return

        # 3. TEST: Add Message
        print("3. Adding Message...")
        try:
            msg = await chat_service.add_message(db, conv.id, "user", "Hello World")
            print(f"✅ Message Added: {msg.id}")
        except Exception as e:
            print(f"❌ Add Message Failed: {e}")
            return
            
        print("✅ DB OPERATIONS PASSED.")

if __name__ == "__main__":
    asyncio.run(debug_chat_db())

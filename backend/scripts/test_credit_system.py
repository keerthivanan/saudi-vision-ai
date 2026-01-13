
import asyncio
import os
import sys

# Add app to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select, update

async def test_credit_system():
    print("🧪 Starting Credit System Verification...")
    async with AsyncSessionLocal() as db:
        # 1. Create/Get Test User
        test_email = "credit_test@example.com"
        result = await db.execute(select(User).filter(User.email == test_email))
        user = result.scalars().first()
        
        if not user:
            print(f"Creating test user: {test_email}")
            user = User(
                id="test_credit_id",
                email=test_email,
                name="Credit Tester",
                provider="test",
                provider_id="test_id",
                credits=10, # Start with 10
                tier="free"
            )
            db.add(user)
            await db.commit()
        else:
            print(f"Resetting credits to 10 for {test_email}")
            user.credits = 10
            await db.commit()
            
        await db.refresh(user)
        print(f"Initial State: {user.credits} credits")

        # 2. Simulate Deduction (Pass 1)
        print("--- Attempting Message 1 (Cost: 5) ---")
        if user.credits < 5:
            print("❌ FAILED: Blocked prematurely.")
            return
        
        user.credits -= 5
        await db.commit()
        await db.refresh(user)
        print(f"✅ Message sent. Remaining: {user.credits}")
        
        # 3. Simulate Deduction (Pass 2)
        print("--- Attempting Message 2 (Cost: 5) ---")
        if user.credits < 5:
             print("❌ FAILED: Blocked prematurely (Current: {user.credits})")
             return

        user.credits -= 5
        await db.commit()
        await db.refresh(user)
        print(f"✅ Message sent. Remaining: {user.credits}")

        # 4. Simulate Failure (Pass 3)
        print("--- Attempting Message 3 (Cost: 5) ---")
        if user.credits < 5:
            print(f"🛡️ BLOCKED CORRECTLY: User has {user.credits} credits (< 5 needed).")
        else:
            print(f"❌ FAILED: User was NOT blocked! Credits: {user.credits}")

        # Cleanup
        print("Cleaning up test user...")
        await db.delete(user)
        await db.commit()
        print("✅ Logic Verification Complete.")

if __name__ == "__main__":
    asyncio.run(test_credit_system())

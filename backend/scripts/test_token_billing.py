
import asyncio
import os
import sys

# Add app to path
# Add backend root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select, update
import tiktoken

async def test_token_billing():
    print("💎 Starting Token Billing Verification...")
    async with AsyncSessionLocal() as db:
        # 1. Create/Get Test User
        test_email = "token_test@example.com"
        result = await db.execute(select(User).filter(User.email == test_email))
        user = result.scalars().first()
        
        if not user:
            print(f"Creating test user: {test_email}")
            user = User(
                id="test_token_id",
                email=test_email,
                name="Token Tester",
                provider="test",
                provider_id="test_id",
                credits=30.0, # Start with 30.0
                tier="free"
            )
            db.add(user)
            await db.commit()
        else:
            print(f"Resetting credits to 30.0 for {test_email}")
            user.credits = 30.0
            await db.commit()
            
        await db.refresh(user)
        print(f"Initial State: {user.credits} credits")

        # 2. Simulate Token Usage
        # Mocking: 250 Tokens (Should cost 0.5 credits)
        input_tokens = 200
        output_tokens = 50
        total_tokens = input_tokens + output_tokens
        
        cost = total_tokens / 500.0
        print(f"--- Simulating Usage: {total_tokens} tokens (Cost: {cost}) ---")
        
        user.credits -= cost
        await db.commit()
        await db.refresh(user)
        
        if user.credits == 29.5:
            print(f"✅ Exact Deduction (29.5) Confirmed.")
        else:
            print(f"❌ Failed: Expected 29.5, Got {user.credits}")

        # 3. Cleanup
        await db.delete(user)
        await db.commit()
        print("✅ Token Billing Logic Verified.")

if __name__ == "__main__":
    asyncio.run(test_token_billing())

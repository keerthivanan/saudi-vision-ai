
import asyncio
import sys
import os
from sqlalchemy import select, update

# Setup Path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import AsyncSessionLocal
from app.models.user import User

async def fix_credits():
    print("🔧 RESETTING ALL USERS TO 30.0 CREDITS...")
    
    async with AsyncSessionLocal() as db:
        # 1. Fetch all users
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        for user in users:
            print(f"   Found User: {user.email} (Current: {user.credits})")
            
            # Reset
            await db.execute(
                update(User)
                .where(User.id == user.id)
                .values(credits=30.0)
            )
            print(f"   ✅ Reset {user.email} to 30.0")
            
        await db.commit()
        print("🎉 ALL CREDITS RESET TO DEFAULT (30.0).")

if __name__ == "__main__":
    asyncio.run(fix_credits())

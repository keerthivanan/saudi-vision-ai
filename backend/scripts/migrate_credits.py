import asyncio
import sys
import os

# Add parent directory to path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.db.session import engine

async def migrate():
    print("🔄 Starting Migration: Adding 'credits' and 'tier' to 'users' table...")
    async with engine.begin() as conn:
        try:
            # 1. Add credits column
            print("   -> Adding column 'credits'...")
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 50"))
            
            # 2. Add tier column
            print("   -> Adding column 'tier'...")
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR DEFAULT 'free'"))
            
            print("✅ Migration Successful! Columns added.")
        except Exception as e:
            print(f"❌ Migration Failed: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())

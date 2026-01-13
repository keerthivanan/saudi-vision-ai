
import asyncio
import os
import sys

# Add app to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import AsyncSessionLocal
from sqlalchemy import text

async def migrate_credits_to_float():
    print("🔄 Migrating 'credits' column to FLOAT...")
    async with AsyncSessionLocal() as db:
        try:
            # 1. Alter Column Type
            await db.execute(text("ALTER TABLE users ALTER COLUMN credits TYPE FLOAT USING credits::double precision;"))
            
            # 2. Set Default to 30.0
            await db.execute(text("ALTER TABLE users ALTER COLUMN credits SET DEFAULT 30.0;"))
            
            # 3. Update existing NULLs or old defaults if needed (Optional, user didn't ask to reset everyone, but let's ensure type safety)
            # await db.execute(text("UPDATE users SET credits = 30.0 WHERE credits IS NULL;")) # Safe default

            await db.commit()
            print("✅ Migration Successful: 'credits' is now FLOAT (Default 30.0).")
        except Exception as e:
            print(f"❌ Migration Failed: {str(e)}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(migrate_credits_to_float())

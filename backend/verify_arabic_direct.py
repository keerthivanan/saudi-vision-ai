import asyncio
import sys
import os
import json

# Ensure we can import app
sys.path.append(os.getcwd())

from app.services.ai_service import ai_service
from app.api.deps import AsyncSession 

class MockDB:
    pass

async def verify_arabic():
    print("🔬 VERIFYING ARABIC RAG CAPABILITIES...")
    query = "ما هي ركائز رؤية 2030؟" # "What are the pillars of Vision 2030?"
    history = [{"role": "user", "content": query}]
    
    print(f"1. Sending Arabic Query: '{query}'")
    
    translation_verified = False
    
    try:
        async for chunk in ai_service.generate_response_stream(
            query=query, # Fixed arg
            history=history,
            db_session=MockDB(), 
            language="ar"
        ):
            # Parse chunk to check translation event
            try:
                data = json.loads(chunk)
                if data.get("event") == "status":
                    status = data.get("data", "")
                    print(f"   STATUS: {status}")
                    # Look for "Searching Knowledge Base ('What is...')" or similar to PROVE translation happened
                    if "Searching Knowledge Base" in status and "Vision 2030" in status:
                         print("   ✅ Translation Logic Verified (English Query detected in logs)")
                         translation_verified = True
                
                if data.get("event") == "token":
                    # Just print first few chars
                    chars = data.get("data", "")
                    sys.stdout.write(chars)
                    sys.stdout.flush()
            except:
                pass
            
        print("\n\n✅ Arabic Stream Completed.")
        
    except Exception as e:
        print(f"\n❌ ARABIC VERIFICATION FAILED:\n{e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(verify_arabic())

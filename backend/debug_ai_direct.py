import asyncio
import sys
import os

# Ensure we can import app
sys.path.append(os.getcwd())

from app.services.ai_service import ai_service
from app.api.deps import AsyncSession # We need to mock DB session

class MockDB:
    pass

async def debug_ai():
    print("🔬 DEBUGGING AI SERVICE (STREAM)...")
    query = "What is Vision 2030?"
    history = [{"role": "user", "content": query}]
    
    try:
        print(f"1. 🔍 RETRIEVING DOCUMENT CONTENT FOR: '{query}'...")
        # Manually search to show the user the RAW SOURCE
        docs = await ai_service.rag_service.search(query, top_k=1)
        if docs:
            print(f"\n📄 [RAW SOURCE DOCUMENT]:\n{docs[0]['content'][:300]}...\n(Source: {docs[0]['source']})\n")
        else:
            print("⚠️ No documents found (Simulated Mode might be active).")
            
        print(f"2. 🤖 GENERATING AI REFRAMED ANSWER...")
        
        full_response = ""
        async for chunk in ai_service.generate_response_stream(
            query=query,
            history=history,
            db_session=MockDB(), 
            language="en"
        ):
            try:
                data = json.loads(chunk)
                if data.get("event") == "token":
                    content = data.get("data", "")
                    sys.stdout.write(content)
                    sys.stdout.flush()
                    full_response += content
            except:
                pass
            
        print("\n\n✅ Stream Completed.")
        print("\n🔎 VERDICT:")
        if len(full_response) > len(docs[0]['content'][:100]) and full_response != docs[0]['content']:
             print("✅ AI SUCCESFULLY REFRAMED THE TEXT (Synthesis Confirmed).")
        else:
             print("⚠️ Warning: Output might be too similar or empty.")
            
    except Exception as e:
        print(f"\n❌ CRITICAL AI ERROR:\n{e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(debug_ai())

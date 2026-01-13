import asyncio
import sys
import os

# Ensure we can import app
sys.path.append(os.getcwd())

from app.services.rag_service import rag_service

async def debug_rag():
    print("🔬 DEBUGGING RAG SERVICE...")
    query = "What is Vision 2030?"
    
    try:
        print(f"1. Testing Embeddings (Model: text-embedding-3-large)...")
        if not rag_service.embeddings:
            print("❌ Embeddings Object is None!")
            return
            
        emb = rag_service.embeddings.embed_query("test")
        print(f"✅ Embeddings Working (Length: {len(emb)})")
        
        print(f"2. Testing Search ('{query}')...")
        results = await rag_service.search(query)
        print(f"✅ Search Returned {len(results)} results")
        for r in results:
            print(f"   - {r['source']}: {r['content'][:50]}...")
            
    except Exception as e:
        print(f"\n❌ CRITICAL RAG ERROR:\n{e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Fix for asyncio loop
    loop = asyncio.get_event_loop()
    loop.run_until_complete(debug_rag())

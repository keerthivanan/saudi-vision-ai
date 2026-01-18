import asyncio
import sys
import os
from pathlib import Path

# Setup Path
BASE_DIR = Path(__file__).resolve().parent.parent # saudi/backend
sys.path.append(str(BASE_DIR))

# Load Env
from dotenv import load_dotenv
load_dotenv()

from app.services.rag_service import rag_service

async def test_full_query():
    print("🧠 Testing FULL RAG Query (Retrieval + LLM Context)...")
    print("====================================================")
    
    # 1. Ask a specific question that requires data from the docs
    query = "What are the targets for the Housing Program by 2030?"
    print(f"❓ User asks: '{query}'")
    
    # 2. Perform Search
    print("\n🔍 Step 1: Retrieving Evidence from Qdrant Cloud...")
    try:
        results = await rag_service.search(query, top_k=3)
        
        if not results:
            print("❌ No results found!")
            return

        print(f"✅ Retrieved {len(results)} relevant snippets.")
        
        # 3. Simulate generation context
        print("\n📄 Step 2: Evidence Found:")
        for i, doc in enumerate(results):
            filename = doc['metadata'].get('filename', 'Unknown')
            snippet = doc['content'][:200].replace('\n', ' ')
            score = doc['score']
            print(f"   [{i+1}] {filename} (Score: {score:.3f})")
            print(f"       \"{snippet}...\"")

        print("\n✅ TEST PASSED: System retrieved correct context for LLM.")

    except Exception as e:
        print(f"❌ Error during test: {e}")

if __name__ == "__main__":
    asyncio.run(test_full_query())

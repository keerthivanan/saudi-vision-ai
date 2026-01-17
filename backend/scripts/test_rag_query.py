import asyncio
import os
import sys
import logging
from dotenv import load_dotenv

# Allow multiple OpenMP runtimes (Fix for FAISS + Torch conflict)
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# Setup path to import backend modules
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv()

# Configure logging to see RAGService output
logging.basicConfig(level=logging.INFO)

from app.services.rag_service import rag_service
from app.core.config import settings

async def test_brain():
    print(f"🔧 Configured Vector DB Path: {settings.VECTOR_DB_PATH}")
    print(f"🔧 Path Exists? {os.path.exists(settings.VECTOR_DB_PATH)}")
    
    query = "What are the main goals of the Health Sector Transformation Program?"
    print(f"\n🧠 ASKING BRAIN: '{query}'\n")
    
    results = await rag_service.search(query, top_k=3)
    
    if not results:
        print("❌ No results found! The brain is empty or broken.")
        return

    print(f"✅ Found {len(results)} relevant knowledge chunks.\n")
    
    print("--- SOURCES USED ---")
    for res in results:
        print(f"📄 {res['source']}")
    print("--------------------\n")
    
    print("\n🤔 GENERATING FULL ANSWER (Smartest of All Time logic)...")
    from app.services.ai_service import ai_service
    
    # Mock message history
    messages = [{"role": "user", "content": query}]
    
    # Get full answer
    answer = await ai_service.get_chat_completion(messages)
    
    print("\n" + "="*50)
    print("🤖 FINAL AI ANSWER:")
    print("="*50)
    print(answer)
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(test_brain())

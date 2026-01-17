import asyncio
import os
import sys
import logging
from dotenv import load_dotenv

# Allow multiple OpenMP runtimes
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# Setup path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

from app.services.rag_service import rag_service
from app.services.ai_service import ai_service

async def test_arabic():
    # "What are the goals of the health program?" in Arabic
    query_arabic = "ما هي أهداف برنامج التحول الصحي؟" 
    
    print(f"\n🧠 TESTING ARABIC INPUT: '{query_arabic}'\n")
    
    # 1. Test Translation Logic (Simulating what AI Service does internally)
    print("--- 1. TRANSLATION CHECK ---")
    translation = await ai_service._detect_and_translate(query_arabic)
    print(f"✅ Detected Language: {translation['language']}")
    print(f"✅ Translated Query: {translation['search_query']}")
    
    # 2. Test Retrieval with Translated Query
    print("\n--- 2. RETRIEVAL CHECK (Using Translated Query) ---")
    results = await rag_service.search(translation['search_query'], top_k=3)
    
    if not results:
        print("❌ No results found!")
    else:
        print(f"✅ Found {len(results)} chunks.")
        for res in results:
            print(f"   📄 {res['source']}")
            
    # 3. Test Full Generation
    print("\n--- 3. FULL GENERATION (End-to-End) ---")
    messages = [{"role": "user", "content": query_arabic}]
    
    answer = await ai_service.get_chat_completion(messages)
    
    print("\n" + "="*50)
    print("🤖 FINAL AI ANSWER:")
    print("="*50)
    # Proper terminal encoding for Arabic can be tricky in some shells, 
    # but we will try to print it.
    try:
        print(answer)
    except Exception as e:
        print(f"(Could not print Arabic text to console due to encoding: {e})")
        print("Raw bytes:", answer.encode('utf-8'))
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(test_arabic())

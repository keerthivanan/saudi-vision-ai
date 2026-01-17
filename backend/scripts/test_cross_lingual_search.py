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

async def test_english_to_arabic_search():
    # User's Specific Challenge Query
    query = "what are schemes of housing behalf of saudi vision 2030"
    
    print(f"\n🧠 CROSS-LINGUAL TEST (English Query -> Arabic Doc)")
    print(f"❓ Query: '{query}'\n")
    
    # NEW: Test the AI Service Logic directly to see if it generates ARABIC query too
    from app.services.ai_service import ai_service
    
    print("--- 1. SMART TRANSLATION CHECK ---")
    lang_data = await ai_service._detect_and_translate(query)
    print(f"Queries Generated: {lang_data['queries']}")
    
    if len(lang_data['queries']) > 1:
        print("✅ SUCCESS: System generated BOTH English and Arabic search queries.")
    else:
        print("❌ FAILURE: Only one query generated.")

    print("\n--- 2. EXECUTING DUAL SEARCH ---")
    # This simulates what generate_response_stream does
    found_arabic_doc = False
    
    for q in lang_data['queries']:
        print(f"   🔎 Searching for: '{q}'")
        results = await rag_service.search(q, top_k=5)
        for res in results:
            source = res['source']
            is_arabic = "ar.pdf" in source
            if is_arabic:
                print(f"      ✅ FOUND ARABIC DOC: {source}")
                found_arabic_doc = True
    
    print("\n" + "="*50)
    if found_arabic_doc:
        print("✅ FINAL SUCCESS: Found Arabic Document via Dual-Path Search!")
    else:
        print("⚠️ NOTICE: English search worked, but specific Arabic doc not top rank.")
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(test_english_to_arabic_search())

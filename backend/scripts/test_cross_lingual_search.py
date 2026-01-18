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

async def test_cross_lingual():
    print("🌍 Testing Cross-Lingual Capabilities (Arabic <-> English)")
    print("========================================================")
    
    # Test 1: Query in English -> Should find Arabic docs too?
    # Or specifically query for a topic we know has Arabic docs (like NIDLP)
    query_en = "What are the NIDLP annual report details for 2020?"
    print(f"\n🇬🇧 Question (English): '{query_en}'")
    
    results = await rag_service.search(query_en, top_k=5)
    
    found_ar = False
    found_en = False
    
    for i, doc in enumerate(results):
        filename = doc['metadata'].get('filename', '').lower()
        score = doc['score']
        print(f"   [{i+1}] Found: {filename} (Score: {score:.3f})")
        
        if "_ar.pdf" in filename:
            found_ar = True
        if "_en.pdf" in filename:
            found_en = True

    if found_ar:
        print("✅ SUCCESS: Found ARABIC document using ENGLISH query!")
    else:
        print("⚠️  Note: Only English documents found (this is normal if English content is a better match).")

    # Test 2: Query in Arabic
    query_ar = "ما هي أهداف رؤية 2030؟" # What are the goals of Vision 2030?
    print(f"\n🇸🇦 Question (Arabic): '{query_ar}'")
    
    results_ar = await rag_service.search(query_ar, top_k=5)
    
    for i, doc in enumerate(results_ar):
        filename = doc['metadata'].get('filename', '').lower()
        score = doc['score']
        # Try to detect if content is english or arabic
        print(f"   [{i+1}] Found: {filename} (Score: {score:.3f})")

if __name__ == "__main__":
    asyncio.run(test_cross_lingual())

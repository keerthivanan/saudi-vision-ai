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
logging.basicConfig(level=logging.ERROR) # Only show errors to keep output clean

from app.services.ai_service import ai_service
from app.services.rag_service import rag_service

async def test_bilingual_retrieval():
    # User Query
    query = "what are schemes of housing behalf of saudi vision 2030"
    
    print(f"\n🧠 BILINGUAL CONTEXT TEST")
    print(f"❓ User Query: '{query}'\n")
    
    # 1. GENERATE DUAL QUERIES
    print("--- 1. GENERATING QUERIES ---")
    lang_data = await ai_service._detect_and_translate(query)
    queries = lang_data['queries']
    print(f"✅ Generated {len(queries)} Query Variations: {queries}")
    
    # 2. PERFORM UNION SEARCH
    print("\n--- 2. RETRIEVING DOCUMENTS (UNION) ---")
    
    english_docs = 0
    arabic_docs = 0
    seen_sources = set()
    all_context = []
    
    for q in queries:
        print(f"  🔎 Searching for: '{q}'")
        docs = await rag_service.search(q, top_k=5)
        for doc in docs:
            source = doc['source']
            if source not in seen_sources:
                seen_sources.add(source)
                
                # Check Language of Document
                is_arabic = "ar.pdf" in source or any('\u0600' <= char <= '\u06FF' for char in doc['content'])
                
                if is_arabic:
                    arabic_docs += 1
                    prefix = "🇸🇦 [AR]"
                else:
                    english_docs += 1
                    prefix = "🇺🇸 [EN]"
                    
                print(f"     + Found: {prefix} {source.split('/')[-1]}")
                all_context.append(doc)

    print("\n--- 3. CONTEXT SENT TO LLM ---")
    print(f"Total Documents: {len(all_context)}")
    print(f"🇺🇸 English Documents: {english_docs}")
    print(f"🇸🇦 Arabic Documents:  {arabic_docs}")
    
    if english_docs > 0 and arabic_docs > 0:
        print("\n✅ SUCCESS: The LLM is receiving a HYBRID context (Both English & Arabic).")
        print("   It will synthesize the answer from ALL these sources.")
    elif english_docs > 0:
        print("\n⚠️ WARNING: Only English docs found. (Arabic docs might not match this query or rank lower)")
    elif arabic_docs > 0:
        print("\n⚠️ WARNING: Only Arabic docs found.")
    else:
        print("\n❌ ERROR: No documents found.")

    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(test_bilingual_retrieval())

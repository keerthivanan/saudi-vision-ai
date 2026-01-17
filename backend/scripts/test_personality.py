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
logging.basicConfig(level=logging.ERROR)

from app.services.ai_service import ai_service
from app.services.rag_service import rag_service

async def test_grounded_personality():
    query = "What are the key goals of the Housing Program?"
    
    print(f"\n🧠 TESTING PERSONALITY & GROUNDING")
    print(f"❓ Query: '{query}'\n")
    
    # 1. Get the Raw Context first to compare
    print("--- 1. RETRIEVING DOCUMENT CONTEXT ---")
    docs = await rag_service.search(query, top_k=3)
    context_text = " ".join([d['content'] for d in docs])
    print(f"✅ Retrieved {len(docs)} chunks of real data.")
    
    # 2. Get AI Response
    print("\n--- 2. GENERATING AI RESPONSE (With Storyteller & Gems) ---")
    messages = [{"role": "user", "content": query}]
    response = await ai_service.get_chat_completion(messages)
    
    print("\n🤖 AI OUTPUT:")
    print("="*60)
    print(response)
    print("="*60)
    
    # 3. VERIFICATION
    print("\n--- 3. TRUTH VERIFICATION ---")
    
    # Check for Hidden Gem
    if "💎" in response:
        print("✅ 'Hidden Gem' Feature is ACTIVE.")
        
        # Extract the gem text
        gem_text = response.split("💎")[-1].strip()
        print(f"   💍 Gem Content: '{gem_text[:50]}...'")
        
        # Strict Check: Is this fake or real?
        # We check if key words/numbers from the gem exist in the context
        # This is a heuristic, but good enough for a demo.
        
        # Find numbers in gem
        import re
        gem_numbers = re.findall(r'\d+', gem_text)
        
        found_match = False
        if not gem_numbers:
             # If no numbers, check for 4-word overlap
             words = gem_text.split()
             for i in range(len(words)-3):
                 phrase = " ".join(words[i:i+4])
                 if phrase.lower() in context_text.lower():
                     found_match = True
                     break
        else:
            # Check if numbers exist in context
            matches = [n for n in gem_numbers if n in context_text]
            if matches:
                found_match = True
                print(f"   ✅ VERIFIED: The number(s) {matches} in the Gem appear in the source documents.")
        
        if found_match:
             print("   ✅ CONCLUSION: The Hidden Gem is REAL data from your PDFs.")
        else:
             print("   ⚠️ WARNING: Gem might be general knowledge or Hallucination. Check carefully.")
             
    else:
        print("❌ 'Hidden Gem' NOT detected.")

    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(test_grounded_personality())

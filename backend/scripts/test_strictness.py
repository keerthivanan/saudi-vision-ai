
import asyncio
from app.services.ai_service import ai_service
from langchain_core.messages import HumanMessage

async def test_strictness():
    print("--- STRICTNESS TEST ---")
    
    # 1. Ask something definitely NOT in Saudi Vision 2030 docs, but known to GPT
    query = "Who won the FIFA World Cup in 2022?"
    
    print(f"Query: '{query}'")
    print("Expected Behavior: Should refuse or say it's not in the context (if Strict).")
    print("Actual Behavior: ...")
    
    # We use the internal method to see the stream or complete
    response_text = ""
    async for chunk_str in ai_service.generate_response_stream(query, [], None):
        import json
        chunk = json.loads(chunk_str)
        if chunk.get("event") == "token":
            print(chunk.get("data"), end="", flush=True)
            response_text += chunk.get("data", "")
            
    print("\n\n--- ANALYSIS ---")
    if "Argentina" in response_text:
        print("❌ RESULT: AI used General Knowledge (Not Strict).")
    else:
        print("✅ RESULT: AI Refused/Stuck to Context (Strict).")

if __name__ == "__main__":
    asyncio.run(test_strictness())

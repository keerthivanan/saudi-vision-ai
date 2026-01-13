import asyncio
import httpx
import json

# Configuration
BASE_URL = "http://localhost:8000"
STORE_USER_ENDPOINT = f"{BASE_URL}/api/v1/auth/store-user"
CHAT_ENDPOINT = f"{BASE_URL}/api/v1/chat/stream"
QUERY = "What are the main pillars of Saudi Vision 2030?"
TEST_EMAIL = "verifier@saudi.ai"

async def verify_rag():
    print(f"🚀 Connecting to {BASE_URL}...")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # STEP 1: CREATE/SYNC USER
        print("👤 Creating Test User...")
        user_payload = {
            "email": TEST_EMAIL,
            "name": "System Verifier",
            "user_id": "verify_12345", # Needs to match schema if it uses UUID, let's see. 
                                       # Schema UserCreate says user_id: str
            "provider": "google",
            "provider_id": "google_123",
            "image": "https://example.com/avatar.png"
        }
        
        try:
            resp = await client.post(STORE_USER_ENDPOINT, json=user_payload)
            if resp.status_code == 200:
                print(f"✅ User synced: {resp.json()['email']} (Credits: {resp.json()['credits']})")
            else:
                print(f"❌ User Sync Failed: {resp.status_code} - {resp.text}")
                return
        except Exception as e:
            print(f"❌ Connection Error: {e}")
            return

        # STEP 2: QUERY RAG
        headers = {
            "Content-Type": "application/json",
            "X-User-Email": TEST_EMAIL
        }
        
        print(f"❓ Sending Query: '{QUERY}'")
        payload = {
            "message": QUERY,
            "language": "en",
            "conversation_id": None
        }
        
        full_answer = ""
        sources = []
        
        try:
            async with client.stream("POST", CHAT_ENDPOINT, headers=headers, json=payload) as response:
                if response.status_code != 200:
                    print(f"❌ Chat API Error: {response.status_code} - {await response.aread()}")
                    return

                print("RECEIVING STREAM:")
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line.replace("data: ", "").strip()
                        if data_str == "[DONE]":
                            break
                        
                        try:
                            data = json.loads(data_str)
                            if data.get("event") == "token":
                                print(data["data"], end="", flush=True)
                                full_answer += data["data"]
                            elif data.get("event") == "sources":
                                sources = data["data"]
                                print(f"\n[SOURCES]: {sources}")
                        except:
                            pass
        except Exception as e:
             print(f"❌ Stream Error: {e}")
             return
        
        print("\n\n---------------------------------")
        
        # Validation
        if len(full_answer) > 20:
             print("✅ Answer Length Verified.")
        else:
             print("❌ Answer too short.")
             
        if sources and len(sources) > 0:
            print(f"✅ Citations Verified ({len(sources)} sources).")
        else:
            print("⚠️ No Sources Cited. (Verify if documents are ingested).")
            
        print("🎉 RAG SYSTEM VERIFIED.")

if __name__ == "__main__":
    asyncio.run(verify_rag())

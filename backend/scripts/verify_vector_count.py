import os
import sys
from dotenv import load_dotenv
from qdrant_client import QdrantClient

# Setup
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv()

from app.core.config import settings

def check_count():
    print("📊 VERIFYING QDRANT BRAIN")
    print("=========================")
    
    try:
        # Initialize Client
        if settings.QDRANT_MODE == "local":
            path = settings.QDRANT_PATH
            print(f"🔌 Connecting to Local Qdrant: {path}")
            client = QdrantClient(path=path)
        else:
            host = settings.QDRANT_HOST
            port = settings.QDRANT_PORT
            print(f"🌐 Connecting to Qdrant Server: {host}:{port}")
            client = QdrantClient(host=host, port=port)
            
        collection_name = settings.QDRANT_COLLECTION_NAME
        
        # Check if collection exists
        collections = client.get_collections().collections
        exists = any(c.name == collection_name for c in collections)
        
        if not exists:
            print(f"❌ Collection '{collection_name}' not found!")
            return

        # Get stats
        count_result = client.count(collection_name=collection_name, exact=True)
        num_vectors = count_result.count
        
        print(f"🧠 Total Knowledge Chunks (Vectors): {num_vectors}")
        
        if num_vectors > 12000:
             print("✅ Count looks healthy (>12k).")
        elif num_vectors == 0:
             print("⚠️  Brain is empty.")
        else:
             print(f"ℹ️  Count is: {num_vectors}")

        # Basic "Unique Document" check using scroll (Limit 100 just to sample)
        print("\n🔎 Sampling for Duplication Check...")
        points, _ = client.scroll(
            collection_name=collection_name,
            limit=100,
            with_payload=True
        )
        
        seen_sources = set()
        for p in points:
            if p.payload and "source" in p.payload:
                seen_sources.add(p.payload["source"])
        
        print(f"ℹ️  Sample run found {len(seen_sources)} unique files in first 100 chunks.")
        for s in list(seen_sources)[:3]:
            print(f" - {s}")

    except Exception as e:
        print(f"❌ Error verifying Qdrant: {e}")

if __name__ == "__main__":
    check_count()

import asyncio
import os
import sys
import logging
from dotenv import load_dotenv
from qdrant_client import QdrantClient

# Allow multiple OpenMP runtimes
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# Setup path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

from app.core.config import settings

async def list_files():
    print(f"🔌 Connecting to Qdrant: {settings.QDRANT_PATH}")
    
    client = QdrantClient(path=settings.QDRANT_PATH)
    
    # Scroll through all points to collect metadata
    # This might be slow for huge DBs but fine for <20k
    
    unique_files = set()
    next_offset = None
    total_scanned = 0
    arabic_content_count = 0
    
    print("Please wait, scanning index...")
    
    while True:
        records, next_offset = client.scroll(
            collection_name=settings.QDRANT_COLLECTION_NAME,
            limit=100,
            offset=next_offset,
            with_payload=True,
            with_vectors=False
        )
        
        for record in records:
            payload = record.payload or {}
            
            # DEBUG: Print first payload to see issues
            if total_scanned == 0:
                print(f"🔍 DEBUG: First Record Payload keys: {list(payload.keys())}")
                print(f"🔍 DEBUG: First Record Payload: {payload}")

            # Correctly access nested metadata
            meta = payload.get("metadata", {})
            source = meta.get("source") or meta.get("filename")
            
            if source:
                filename = source.split("/")[-1]
                unique_files.add(filename)
            
            # Check content for Arabic
            content = payload.get("page_content", "")
            if any('\u0600' <= char <= '\u06FF' for char in content):
                arabic_content_count += 1

    print(f"\n✅ Scan Complete. Analyzed {total_scanned} vectors.")
    print(f"📂 Found {len(unique_files)} Unique Documents.")
    
    print(f"🇸🇦 Chunks with Arabic Content: {arabic_content_count}")
    
    print("\n📄 Document List:")
    arabic_filename_detected = False
    for f in sorted(list(unique_files)):
        is_arabic_name = any('\u0600' <= char <= '\u06FF' for char in f)
        prefix = "🇸🇦" if is_arabic_name else "📄"
        print(f" {prefix} {f}")
        
        if is_arabic_name:
            arabic_filename_detected = True

    print("\n" + "="*40)
    if arabic_filename_detected or arabic_content_count > 0:
        print("✅ ARABIC PROCESSED (Filenames or Content).")
    else:
        print("⚠️ NO ARABIC DETECTED.")
    print("="*40 + "\n")

if __name__ == "__main__":
    asyncio.run(list_files())

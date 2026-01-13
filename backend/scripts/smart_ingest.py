
import asyncio
import os
import sys
import boto3
import tempfile
from typing import List

# Setup Path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.core.config import settings
from app.services.document_service import document_service
from app.services.rag_service import rag_service

# Load Env
from dotenv import load_dotenv
load_dotenv()

async def smart_ingest():
    print("🧠 SMART HYBRID INGESTION (S3 -> VECTOR BRAIN)")
    print("==============================================")
    
    bucket_name = settings.S3_BUCKET_NAME
    if not bucket_name:
        bucket_name = os.getenv("S3_BUCKET_NAME")
        
    print(f"📡 Connecting to Cloud Vault: {bucket_name}")
    
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID or os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=settings.AWS_REGION or os.getenv("AWS_REGION")
    )
    
    # 1. Scan S3
    try:
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix="documents/")
        if 'Contents' not in response:
            print("⚠️ Vault is empty. Upload files first!")
            return
            
        objects = response['Contents']
        print(f"🔍 Found {len(objects)} documents in the Vault.")
        
        for obj in objects:
            key = obj['Key']
            if key.endswith('/'): continue # Skip folders
            
            print(f"\n📄 Processing: {key}")
            
            # Smart Stream Download (No massive disk usage)
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                s3.download_fileobj(bucket_name, key, tmp_file)
                tmp_path = tmp_file.name
                
            # Read Content
            with open(tmp_path, "rb") as f:
                content = f.read()
                
            # Extract Text & Metadata
            # We treat the filename as the key basename
            filename = os.path.basename(key)
            processed_doc = await document_service.process_file(content, filename)
            
            if processed_doc:
                # OVERRIDE SOURCE WITH S3 URL
                s3_url = f"s3://{bucket_name}/{key}"
                processed_doc.metadata["source"] = s3_url
                
                print(f"   - Identified: {processed_doc.word_count} words")
                print(f"   - Tagging Source: {s3_url}")
                
                # Ingest into Vector DB
                await rag_service.ingest_document(processed_doc)
                print("   ✅ Learned & Indexed.")
            else:
                print("   ❌ Failed to process content.")
                
            # Cleanup
            os.unlink(tmp_path)
            
        print("\n🏆 SMART INGESTION COMPLETE")
        print("   The AI now knows everything in your S3 Vault.")
            
    except Exception as e:
        print(f"\n❌ CRITICAL FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(smart_ingest())

import asyncio
import os
import sys
import boto3
from pathlib import Path

# Setup Path to import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Load Env
from dotenv import load_dotenv
load_dotenv()

from app.services.rag_service import rag_service
from app.services.document_service import document_service
from app.db.session import AsyncSessionLocal
from app.models.document import Document
from app.models.user import User
from sqlalchemy import select

async def sync_s3_to_vector_db():
    print("🔄 STARTING SYNC: S3 -> VECTOR DATABASE (FAISS)")
    print("==============================================")

    # 1. Connect to S3
    bucket_name = os.getenv("S3_BUCKET_NAME")
    region = os.getenv("AWS_REGION")
    
    if not bucket_name:
        print("❌ Error: S3_BUCKET_NAME not set.")
        return

    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=region
    )

    # 2. List all files in S3
    print(f"📡 Listing objects in bucket: {bucket_name}...")
    try:
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix="documents/")
    except Exception as e:
        print(f"❌ Failed to list S3 objects: {e}")
        return

    if 'Contents' not in response:
        print("⚠️ No documents found in S3 (prefix 'documents/').")
        return
        
    files = response['Contents']
    print(f"🔎 Found {len(files)} files in Cloud Storage.")

    # 3. Process Each File
    count = 0
    errors = 0
    
    # Create temp dir
    os.makedirs("temp_sync", exist_ok=True)

    for obj in files:
        key = obj['Key']
        filename = key.split('/')[-1]
        
        # Skip directories or empty names
        if not filename: 
            continue
            
        print(f"⬇️  Processing: {filename}...", end=" ", flush=True)

        try:
            # Check if file extension is supported
            if not filename.lower().endswith(('.pdf', '.docx', '.txt', '.md')):
                print("Skipped (Format not supported)")
                continue

            # Download to temp
            local_path = f"temp_sync/{filename}"
            s3.download_file(bucket_name, key, local_path)

            # Process (Extract Text + Embed)
            # We assume these are GLOBAL/SYSTEM documents since they are manually uploaded
            # So scope="public" or "system" is appropriate
            processed_doc = await document_service.process_file(
                local_path, 
                original_filename=filename,
                metadata={"scope": "public", "source": f"s3://{bucket_name}/{key}", "user_id": "system"}
            )

            if processed_doc:
                await rag_service.ingest_document(processed_doc)
                count += 1
                print("✅ Indexed")
            else:
                print("⚠️  No text content")

            # Cleanup
            if os.path.exists(local_path):
                os.remove(local_path)

        except Exception as e:
            print(f"❌ Error: {e}")
            errors += 1
            if os.path.exists(local_path):
                os.remove(local_path)

    print("==============================================")
    print(f"🎉 SYNC COMPLETE!")
    print(f"✅ Effectively Ingested: {count} documents")
    print(f"❌ Errors: {errors}")
    print("🧠 Vector Database is now updated with S3 knowledge.")

if __name__ == "__main__":
    asyncio.run(sync_s3_to_vector_db())

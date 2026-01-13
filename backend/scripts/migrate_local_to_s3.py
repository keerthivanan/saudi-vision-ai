
import asyncio
import os
import sys
import boto3

# Setup Path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Load Env
from dotenv import load_dotenv
load_dotenv()

def migrate_documents():
    print("📦 MIGRATING DOCUMENTS TO CLOUD (S3)")
    print("====================================")
    
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
    
    # Point to c:\Users\91709\OneDrive\Documents\saudi\documents
    # Script is in backend/scripts/ -> Go up 2 levels
    doc_dir = os.path.join(os.path.dirname(__file__), "../../documents")
    
    if not os.path.exists(doc_dir):
        print(f"❌ Document directory not found: {doc_dir}")
        return
        
    files = [f for f in os.listdir(doc_dir) if f.endswith(('.pdf', '.docx', '.txt', '.md'))]
    print(f"🔍 Found {len(files)} files to upload.")
    
    for filename in files:
        filepath = os.path.join(doc_dir, filename)
        s3_key = f"documents/{filename}"
        
        print(f"   ⬆️ Uploading: {filename} -> s3://{bucket_name}/{s3_key} ...", end=" ")
        
        try:
            content_type = 'application/octet-stream'
            if filename.endswith('.pdf'): content_type = 'application/pdf'
            
            with open(filepath, "rb") as f:
                s3.put_object(
                    Bucket=bucket_name,
                    Key=s3_key,
                    Body=f,
                    ContentType=content_type
                )
            print("✅ Done")
        except Exception as e:
            print(f"❌ Failed: {e}")
            
    print("\n✅ Migration Complete. All local files are now safe in the Vault.")

if __name__ == "__main__":
    migrate_documents()

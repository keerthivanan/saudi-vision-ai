from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy import select, desc, delete
from app.db.session import get_db, AsyncSession
from app.api.deps import get_current_user
from app.models.document import Document
from app.schemas.user import UserResponse  # Reuse or create document schema if needed

router = APIRouter()

@router.get("/", response_model=List[dict])
async def list_documents(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Retrieve all uploaded documents.
    """
    stmt = select(Document).order_by(desc(Document.created_at)).offset(skip).limit(limit)
    result = await db.execute(stmt)
    documents = result.scalars().all()
    
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_size": doc.file_size,
            "mime_type": doc.mime_type,
            "created_at": doc.created_at,
            "processing_status": doc.processing_status
        }
        for doc in documents
    ]

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_size": doc.file_size,
            "mime_type": doc.mime_type,
            "created_at": doc.created_at,
            "processing_status": doc.processing_status
        }
        for doc in documents
    ]

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user), # Require Auth
    db: AsyncSession = Depends(get_db)
):
    """
    Upload and Process a Document (PDF/TXT) into the RAG System.
    """
    try:
        from app.services.document_service import document_service
        
        # 1. Save to temp
        import shutil
        import os
        from uuid import uuid4
        
        os.makedirs("temp_uploads", exist_ok=True)
        temp_path = f"temp_uploads/{uuid4()}_{file.filename}"
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Process (Upload to S3 + Index in RAG)
        # Pass User ID and Scope='private' to secure this document
        processed_doc = await document_service.process_file(
            temp_path, 
            original_filename=file.filename,
            metadata={"user_id": str(current_user.id), "scope": "private"}
        )

        # CRITICAL FIX: Ingest into Vector DB (The "Fuel" for RAG)
        if processed_doc:
            from app.services.rag_service import rag_service
            await rag_service.ingest_document(processed_doc)
        
        # 3. Create DB Record
        new_doc = Document(
            filename=file.filename,
            file_size=0, 
            mime_type=file.content_type,
            storage_path=processed_doc.metadata.get("source", "s3"),
            processing_status="completed",
            content_hash="hash",
            user_id=str(current_user.id) # Associate with User
        )
        db.add(new_doc)
        await db.commit()
        await db.refresh(new_doc)
        
        # Cleanup
        os.remove(temp_path)
        
        return {"status": "success", "id": new_doc.id, "filename": new_doc.filename, "message": "Indexed Successfully (Private Scope)"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Delete a document from the database.
    Note: This does not remove it from the Vector Index (FAISS) immediately.
    """
    stmt = select(Document).where(Document.id == document_id)
    result = await db.execute(stmt)
    document = result.scalar_one_or_none()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    await db.delete(document)
    await db.commit()
    
    return {"status": "success", "message": "Document deleted"}

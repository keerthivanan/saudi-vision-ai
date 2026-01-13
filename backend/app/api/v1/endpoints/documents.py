from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc, delete
from app.db.session import get_db, AsyncSession
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

@router.delete("/{document_id}")
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

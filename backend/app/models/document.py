from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey
from datetime import datetime
import uuid
from app.db.session import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    text_content = Column(Text, nullable=True)
    doc_metadata = Column(Text, nullable=True)  # JSON string
    processing_status = Column(String, default="pending")
    uploaded_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

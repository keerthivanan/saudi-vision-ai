from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
import uuid
from app.db.session import Base

class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

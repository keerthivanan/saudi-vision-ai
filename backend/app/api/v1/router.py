from fastapi import APIRouter
from app.api.v1.endpoints import auth, chat, documents, contact, payment

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(payment.router, prefix="/payment", tags=["Payment"])

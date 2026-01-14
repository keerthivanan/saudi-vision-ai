import os
# Fix for OpenMP library conflict (FAISS/Intel vs LLVM)
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import engine, Base
# Import all models to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.chat import Conversation, Message
from app.models.document import Document

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            print("✅ Database Tables Verified/Created Successfully")
    except Exception as e:
        print(f"❌ Database Initialization Failed: {e}")
        # We might want to re-raise or handle strictly depending on enterprise needs
    
    yield
    
    # Shutdown: Clean up resources
    await engine.dispose()
    print("🛑 Database Connection Closed")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Enterprise Backend for Saudi Legal AI - Powered by OpenAI & RAG",
    lifespan=lifespan
)

# CORS Middleware
origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
if "http://localhost:3000" not in origins:
    origins.append("http://localhost:3000")
if "http://127.0.0.1:3000" not in origins:
    origins.append("http://127.0.0.1:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex="https://.*", # Allow all Vercel/Railway HTTPS domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router (Primary V1)
app.include_router(api_router, prefix=settings.API_V1_STR)

# LEGACY/SHORTHAND ALIAS (One-Shot Fix for 404)
# Some parts of the frontend might expect /api/auth without /v1
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
async def list_routes():
    print("🚀 REGISTERED ROUTES:")
    for route in app.routes:
        print(f"   {route.methods} {route.path}")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Saudi Legal AI Enterprise API",
        "system_status": "operational",
        "version": "2.1.0 (One-Shot Fix Active)",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

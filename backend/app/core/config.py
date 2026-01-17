from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Saudi Legal AI Enterprise"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:3000"]

    # Database
    DATABASE_URL: str = "postgresql://postgres:2003@localhost:5432/saudi_db_app"
    
    # Security
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE_CHANGE_IN_PRODUCTION"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # AI / OpenAI
    OPENAI_API_KEY: Optional[str] = None
    
    # Vector DB (Legacy Alias updated for Qdrant)
    VECTOR_DB_PATH: str = str(BASE_DIR / "data" / "qdrant_storage")
    
    # Qdrant Config
    # Mode: 'server' (Docker/Cloud) or 'local' (Embedded/Disk)
    QDRANT_MODE: str = "local" 
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_PATH: str = str(BASE_DIR / "data" / "qdrant_storage")
    QDRANT_COLLECTION_NAME: str = "documents"
    QDRANT_API_KEY: Optional[str] = None  # Required for Qdrant Cloud

    # AWS S3 Storage
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "eu-central-1"
    S3_BUCKET_NAME: str = "saudi-vision-ai-storage-917"

    # Razorpay Payments
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()

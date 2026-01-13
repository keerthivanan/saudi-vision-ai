import re
import logging
from typing import Any, Union, Optional
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from app.core.config import settings

description = "Security utilities for PII redaction, Auth, and enterprise logging"

# === AUTHENTICATION & CRYPTO ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# === PII REDACTION ===
# Saudi PII Patterns
PATTERNS = {
    "SAUDI_ID": r"\b[12]\d{9}\b",  # National ID (starts with 1) or Iqama (starts with 2)
    "PHONE": r"\b(05\d{8}|9665\d{8}|\+9665\d{8})\b",
    "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
}

def redact_pii(text: str) -> str:
    """
    Redact Personally Identifiable Information (PII) from text.
    Specifically targets Saudi National IDs, Phone Numbers, and Emails.
    """
    if not isinstance(text, str):
        return text
        
    redacted = text
    
    # Redact National IDs / Iqamas
    redacted = re.sub(PATTERNS["SAUDI_ID"], "[SAUDI_ID_REDACTED]", redacted)
    
    # Redact Phone Numbers
    redacted = re.sub(PATTERNS["PHONE"], "[PHONE_REDACTED]", redacted)
    
    # Redact Emails
    redacted = re.sub(PATTERNS["EMAIL"], "[EMAIL_REDACTED]", redacted)
    
    return redacted

class PIILogger(logging.Logger):
    """
    Custom Logger that automatically redacts PII from log messages.
    """
    def _log(self, level, msg, args, exc_info=None, extra=None, stack_info=False, stacklevel=1):
        if isinstance(msg, str):
            msg = redact_pii(msg)
        super()._log(level, msg, args, exc_info, extra, stack_info, stacklevel)

# Setup Logger
logging.setLoggerClass(PIILogger)
logger = logging.getLogger("saudi_enterprise_security")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - [SECURED] - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

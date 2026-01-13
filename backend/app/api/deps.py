from typing import Generator, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.core.security import ALGORITHM
from sqlalchemy import select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> User:
    """
    Validate the access token and return the current user.
    Supports JWT Bearer OR Trusted Header (for internal Frontend proxy).
    """
    user_email = None

    # 1. Try JWT
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
            token_data = payload.get("sub")
            if token_data:
                # Is it ID or Email? Let's try finding by both or assume email if string
                user_email = token_data 
        except (JWTError, ValidationError):
            pass # Fallback to header

    # 2. Try Trusted Header (Next.js -> FastAPI)
    if not user_email:
        user_email = request.headers.get("X-User-Email")

    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 3. Fetch User
    # Try email match
    query = select(User).where(User.email == user_email)
    result = await db.execute(query)
    user = result.scalars().first()
    
    # If not found by email, try ID (if token_data was ID)
    if not user and token:
         query = select(User).where(User.id == user_email)
         result = await db.execute(query)
         user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user

async def get_current_user_optional(
    request: Request,
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    """
    Same as get_current_user but returns None if auth fails, allowing Guest mode.
    """
    if not token and not request.headers.get("X-User-Email"):
        return None
        
    try:
        return await get_current_user(request, db, token)
    except HTTPException:
        return None


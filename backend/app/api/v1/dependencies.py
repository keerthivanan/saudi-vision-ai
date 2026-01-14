from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.config import settings
from app.core import security
# Import models if needed for user fetching, but keeping it minimal for now to fix import error

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
):
    """
    Validate the token and return the current user.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = payload.get("sub")
        
        if token_data is None:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
             
        # In a real app, you would fetch the user from DB here.
        # For now, to unblock the crash, we return the token subject or a basic user object placeholder
        # Ideally: user = crud.user.get(db, id=token_data)
        return type('User', (object,), {"id": token_data, "is_active": True, "is_superuser": False})

    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from datetime import datetime

from app.db.session import get_db, AsyncSession
from app.models.user import User  # Will create models next
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.post("/store-user", response_model=UserResponse)
async def store_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Store or update user information.
    """
    print(f"👤 STORE_USER ATTEMPT: {user_in.email} (Provider: {user_in.provider})")
    try:
        # Check if user exists
        stmt = select(User).where(User.id == user_in.user_id)
        result = await db.execute(stmt)
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            existing_user.email = user_in.email
            existing_user.name = user_in.name
            existing_user.image = user_in.image
            existing_user.provider = user_in.provider
            existing_user.provider_id = user_in.provider_id
            existing_user.updated_at = datetime.utcnow()
        else:
            new_user = User(
                id=user_in.user_id,
                email=user_in.email,
                name=user_in.name,
                image=user_in.image,
                provider=user_in.provider,
                provider_id=user_in.provider_id,
                credits=30.0, # 🎁 Signup Bonus
                tier="free"
            )
            print(f"🎁 Awarding 30 Free Credits to new user: {user_in.email}")
            db.add(new_user)
            
        await db.commit()
        user_obj = existing_user or new_user
        await db.refresh(user_obj)
        print(f"✅ STORE_USER SUCCESS: {user_obj.email}")
        return user_obj
    except Exception as e:
        await db.rollback()
        print(f"❌ STORE_USER ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

from app.api.deps import get_current_user

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user profile (including credits).
    """
    return current_user


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None


class SettingsUpdate(BaseModel):
    theme: Optional[str] = None  # 'light' or 'dark'
    language: Optional[str] = None  # 'en' or 'ar'
    notifications: Optional[bool] = None


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user's profile information.
    """
    try:
        if profile_data.name is not None:
            current_user.name = profile_data.name
        if profile_data.image is not None:
            current_user.image = profile_data.image
        current_user.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(current_user)
        return current_user
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")


@router.patch("/settings", response_model=UserResponse)
async def update_settings(
    settings_data: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user's settings/preferences.
    """
    try:
        # Store settings as JSON in a preferences field or separate columns
        # For now, we'll just acknowledge the request (settings stored in frontend localStorage)
        current_user.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(current_user)
        return current_user
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Settings update failed: {str(e)}")


@router.delete("/me")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete current user's account (soft delete or hard delete).
    """
    try:
        # For demo mode, we don't actually delete
        # In production: await db.delete(current_user)
        return {"message": "Account deletion is disabled in demo mode", "status": "demo"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")

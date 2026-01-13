from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional
from pydantic import BaseModel
import time

from app.api.v1.dependencies import get_current_user, get_db
from app.services.payment_service import payment_service
from app.models.user import User

router = APIRouter()

class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan: str

@router.post("/checkout")
async def create_order(
    plan: str, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """
    Step 1: Create a Razorpay Order from the Backend.
    """
    if plan == 'standard':
        amount = 50 * 100 # $50.00 -> 5000 cents (or INR equivalent if customized)
        currency = "USD"
        credits = 130
    elif plan == 'royal':
        amount = 120 * 100 # $120.00 -> 12000 cents
        currency = "USD"
        credits = 200
    else:
        raise HTTPException(status_code=400, detail="Invalid plan")

    receipt_id = f"receipt_{current_user.id}_{int(time.time())}"
    
    try:
        order = await payment_service.create_order(
            amount=amount, 
            currency=currency, 
            receipt=receipt_id
        )
        
        return {
            "order_id": order.get("id"),
            "amount": amount,
            "currency": currency,
            "key_id": payment_service.key_id, 
            "plan": plan
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
async def verify_payment(
    payload: PaymentVerificationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Step 2: Verify the Payment Signature and Add Credits.
    """
    is_valid = payment_service.verify_payment_signature(
        payload.razorpay_order_id,
        payload.razorpay_payment_id,
        payload.razorpay_signature
    )

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid Payment Signature")

    # Payment Successful - Add Credits
    credits_to_add = 0
    if payload.plan == 'standard':
        credits_to_add = 130
    elif payload.plan == 'royal':
        credits_to_add = 200
        current_user.tier = "royal"
    else:
        credits_to_add = 0
    
    # Atomic Update
    current_user.credits += credits_to_add
    
    # Save
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return {"status": "success", "new_credits": current_user.credits, "tier": current_user.tier}

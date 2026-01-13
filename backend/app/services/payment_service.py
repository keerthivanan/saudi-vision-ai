import razorpay
from typing import Dict, Any, Optional
from app.core.config import settings
import hmac
import hashlib
import time

class PaymentService:
    def __init__(self):
        self.key_id = settings.RAZORPAY_KEY_ID
        self.key_secret = settings.RAZORPAY_KEY_SECRET
        
        if self.key_id and self.key_secret:
            self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
        else:
            self.client = None

    async def create_order(self, amount: int, currency: str, receipt: str, partial_payment: bool = False) -> Dict[str, Any]:
        """
        Create a Razorpay Order
        Amount should be in smallest currency unit (e.g., paise for INR/cents for USD)
        """
        if not self.client:
            # Return Mock Data if keys are missing (for Testing)
            return {
                "id": f"order_mock_{int(time.time())}",
                "entity": "order",
                "amount": amount,
                "amount_paid": 0,
                "amount_due": amount,
                "currency": currency,
                "receipt": receipt,
                "status": "created",
                "attempts": 0,
                "notes": [],
                "created_at": int(time.time()),
                "is_mock": True
            }

        data = {
            "amount": amount,
            "currency": currency,
            "receipt": receipt,
            "payment_capture": 1 # Auto Capture
        }
        
        try:
            order = self.client.order.create(data=data)
            return order
        except Exception as e:
            print(f"Razorpay Order Creation Failed: {str(e)}")
            raise e

    def verify_payment_signature(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """
        Verify the signature returned by Razorpay after successful payment.
        This provides a secure method to confirm payment authenticity.
        """
        if not self.client:
           return True # Mock always verifies

        try:
            self.client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            return True
        except razorpay.errors.SignatureVerificationError:
            return False
        except Exception as e:
            print(f"Signature Verification Failed: {str(e)}")
            return False

# Global Instance
payment_service = PaymentService()

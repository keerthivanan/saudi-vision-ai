from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.contact import ContactSubmission
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter()

@router.post("/", response_model=ContactResponse)
async def submit_contact_form(
    submission: ContactCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Store contact form submissions in the real database.
    """
    try:
        new_submission = ContactSubmission(
            first_name=submission.first_name,
            last_name=submission.last_name,
            email=submission.email,
            message=submission.message
        )
        
        db.add(new_submission)
        await db.commit()
        await db.refresh(new_submission)
        
        return ContactResponse(
            success=True, 
            message="Submission received successfully.",
            id=new_submission.id
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

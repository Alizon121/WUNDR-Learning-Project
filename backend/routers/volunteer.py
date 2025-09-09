from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from backend.db.prisma_client import db
from typing import Annotated
from backend.models.user_models import User
from backend.models.user_models import Volunteer, VolunteerCreate, VolunteerUpdate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def enroll_volunteer(
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerCreate
):
    """
        Authenticated user
        Enroll as a volunteer
        return Json of enrolled user
    """

    # Validate User
    enforce_authentication(get_current_user)

    try:
        availability_dict = None
        if volunteer_data.availability:
            availability_dict = volunteer_data.availability.model_dump()

        volunteer = await db.volunteer.create(
            data={
                "firstName": volunteer_data.firstName,
                "lastName": volunteer_data.lastName,
                "email": volunteer_data.email,
                "phoneNumber": volunteer_data.phoneNumber,
                "cities": volunteer_data.cities or [],
                "availability": availability_dict,
                "skills": volunteer_data.skills or [],
                "bio": volunteer_data.bio,
                "photoConsent": volunteer_data.photoConsent,
                "backgroundCheckConsent": volunteer_data.backgroundCheckConsent,
                "userId": current_user.id,
                "user": current_user
            }
        )

        return {"volunteer": volunteer}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to enroll volunteer: {e}"
        )
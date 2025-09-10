from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from backend.db.prisma_client import db
from typing import Annotated
from backend.models.user_models import User
from backend.models.user_models import Volunteer, VolunteerCreate, VolunteerUpdate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def volunteer_sign_up(
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerCreate
):
    """
        Authenticated user
        Sign up as a volunteer
        return Json of enrolled user
    """

    # Validate User
    enforce_authentication(current_user)

    existing_volunteer = await db.volunteers.find_unique(
            where={"userId": current_user.id}
        )
        
    if existing_volunteer:
        raise HTTPException(
            status_code=400,
            detail="User is already registered as a volunteer"
        )

    try:
        data = volunteer_data.model_dump()
        data["userId"] = current_user.id
        
        volunteer = await db.volunteers.create(data=data)

        return {"volunteer": volunteer}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to enroll volunteer: {e}"
        )

@router.patch("/", status_code=status.HTTP_200_OK)
async def update_volunteer(
    volunteer_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerUpdate
):
    """
        Authenticate user
        Validate user is the volunteer
        Update volunteer's credentials
        Return updated volunteer
    """

    # Validate user
    enforce_authentication(current_user)

    # Verify the volunteer exists
    volunteer = await db.volunteers.find_unique(
        where={"userId": current_user.id}
    )

    if not volunteer:
        raise HTTPException(
            status_code=400,
            detail="Unable to located volunteer"
        )
    
    # Handle update
    try:
        data = volunteer_data.model_dump()

        updated_volunteer = await db.volunteers.update(
            where={"userId": current_user.id},
            data = data        
        )

        return {"Updated Volunteer": updated_volunteer}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to update volunteer: {e}"
        )

@router.delete("/{volunteer_id}", status_code=status.HTTP_200_OK)
async def delete_volunteer(
    volunteer_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Authenticate user and enforce admin role
        Query and delete volunteer
        return deleted volunteer
    """

    # Validate user
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Query for the volunteer

    volunteer = await db.volunteers.find_unique(
        where={"id": volunteer_id}
    )

    if not volunteer:
        raise HTTPException(
            status_code=404,
            detail="Volunteer not found"
        )

    # Delete the volunteer
    try:
        deleted_volunteer = await db.volunteers.delete(
            where={"id": volunteer_id}
        )

        return {"Deleted Volunteer": deleted_volunteer}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to delete the volunteer: {e}"
        )

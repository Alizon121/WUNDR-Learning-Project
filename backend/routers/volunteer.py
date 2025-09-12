from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from backend.db.prisma_client import db
from typing import Annotated
from backend.models.user_models import User
from backend.models.user_models import Volunteer, VolunteerCreate, VolunteerUpdate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def volunteer_sign_up_general(
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerCreate
):
    enforce_authentication(current_user)

    existing = await db.volunteers.find_unique(where={"userId": current_user.id})
    if existing:
        raise HTTPException(status_code=400, detail="User is already registered as a volunteer")

    try:
        data = volunteer_data.model_dump()
        # ⚠️ Do NOT set userId directly — the relation is mandatory;
        # use a nested `connect` to link the user.
        volunteer = await db.volunteers.create(
            data={
                **data,
                "status": "New",                     
                "user": {"connect": {"id": current_user.id}}, 
            }
        )
        return {"volunteer": volunteer}

    except Exception as e:
        print("VOL_CREATE_ERR:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{opportunity_id}", status_code=status.HTTP_201_CREATED)
async def volunteer_sign_up(
    opportunity_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerCreate
):
    """
        Authenticated user
        Sign up as a volunteer
        Information for volunteer application
        return Json of user's application
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

    # Validate the opportunity exists
    opportunity = await db.volunteeropportunities.find_unique(
        where={"id": opportunity_id}
    )
    
    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Volunteer opportunity not found"
        )
    
    try:
        data = volunteer_data.model_dump()
        data["userId"] = current_user.id
        
        volunteer = await db.volunteers.create(
            data={
                **data,
                "volunteerOpportunities": {
                    "connect": [{"id": opportunity_id}]
                }
            }
        )

        return {"volunteer": volunteer}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to enroll volunteer: {e}"
        )

@router.patch("/", status_code=status.HTTP_200_OK)
async def update_volunteer(
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
        data = volunteer_data.model_dump(exclude_unset=True)

        if not data:
            return {"Original Volunteer": volunteer}

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
@router.patch("/{volunteer_id}/admin", status_code=status.HTTP_200_OK)
async def update_volunteer_admin_only(
    volunteer_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerUpdate
):
    """
        Authenticate and enforce admin for current user
        Allow admin to update volunteer application (e.g. application status)
        Return updated volunteer
    """

    # Validate user
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Validate volunteer exists
    existing_volunteer = await db.volunteers.find_unique(
        where={"id": volunteer_id}
    )

    if not existing_volunteer:
        raise HTTPException(
            status_code=400,
            detail="Unable to locate volunteer"
        )
    
    try:
        data = volunteer_data.model_dump(exclude_none=True)
        if not data:
            return {"Volunteer not updated": existing_volunteer}
        
        updated_volunteer = await db.volunteers.update(
            where={"id": volunteer_id},
            data=data
        )

        return {"Updated Volunteer": updated_volunteer}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Unable to update volunteer"
        )
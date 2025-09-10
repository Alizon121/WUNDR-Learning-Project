from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from backend.db.prisma_client import db
from typing import Annotated
from backend.models.user_models import User

from backend.models.interaction_models import VolunteerOpportunityCreate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_volunteer_opportunity(
      current_user: Annotated[User, Depends(get_current_user)],
      opportunity_data: VolunteerOpportunityCreate
):
    """
        Authenticate and enfroace admin role for current user
        Create a volunteer opoortunity
        return opportunity
    """

    # Validate current user
    enforce_authentication(current_user)

    enforce_admin(current_user)

    try:
        data = opportunity_data.model_dump()

        opportunity = await db.volunteeropportunities.create(
            data=data
        )

        return {"Opportunity": opportunity}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to create volunteer opportunity: {e}"
        )

@router.delete("/{opportunity_id}", status_code=status.HTTP_200_OK)
async def delete_opportunity(
    opportunity_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
        Authenticate and enforce admin for current user
        Delete the opportunity
        return deleted opportunity
    """

    # Validate user
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Query for the opportunity
    try:
        opportunity = await db.volunteeropportunities.find_unique(
            where={"id": opportunity_id}
        )

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Unable to locate opportunity"
            )

        deleted_opportunity = await db.volunteeropportunities.delete(
            where={"id": opportunity_id}
        )

        return {"Deleted Opportunity": delete_opportunity}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to delete volunteer opportunity: {e}"
        )

# * Volunteer Routes ======================================
@router.get("/{opportunity_id}/volunteers/", status_code=status.HTTP_200_OK)
async def get_volunteers_by_opportunity(
    opportunity_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Authenticate and enforce admin of current user
        Obtain all volunteers for a specific opportunity
        return volunteers
    """

    # validate current user
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Query for a volunteer opportunity
    try:
        opportunity = await db.volunteeropportunities.find_unique(
            where={"id": opportunity_id}
        )

        return {"Opportunity": opportunity.volunteerIDs}
    except:
        raise HTTPException(
            status_code=500,
            detail="Unable to obtain opportunity record"
        )
    
@router.get("/{opportunity_id}/volunteers/{volunteer_id}", status_code=status.HTTP_200_OK)
async def get_opportunity_by_volunteer(
    opportunity_id: str,
    volunteer_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Authenticate and enforce admin of current user
        Obtain specific opportunity for a specific volunteer 
        return opportunity
    """

    # validate current user
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Query for a volunteer opportunity
    try:
        opportunity = await db.volunteeropportunities.find_unique(
            where={
                "id": opportunity_id,
                "volunteerIDs": {
                    "has": volunteer_id
                }
                }
        )

        return {"Opportunity": opportunity}
    except:
        raise HTTPException(
            status_code=500,
            detail="Unable to obtain opportunity record"
        )

@router.patch("/{opportunity_id}/volunteers/{volunteer_id}", status_code=status.HTTP_200_OK)
async def enroll_volunteer(
    opportunity_id: str,
    volunteer_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
        Authenticate user and enforce admin
        Admin will add volunteer to opportunity
        return update volunteer opportunity
    """

    # Validate user
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Query for the opportunity
    opportunity = await db.volunteeropportunities.find_unique(
        where={"id": opportunity_id}
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Volunteer opportunity not found"
        )

    existing_volunteer = await db.volunteeropportunities.find_unique(
        where={"id": opportunity_id,
               "volunteerIDs": {
                   "has":volunteer_id
                        }
               }
    )

    if existing_volunteer:
        raise HTTPException(
            status_code=500,
            detail="Volunteer already exists"
        )
    
    # Update the opportunity
    try:

        updated_opportunity = await db.volunteeropportunities.update(
            where={"id": opportunity_id},
            data = {"volunteerIDs": opportunity.volunteerIDs + [volunteer_id]}
        )

        return {"Updated Opportunity": updated_opportunity}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to enroll volunteer: {e}"
        )
    
router.patch("/{opportunity_id}/volunteers/{volunteer_id}", status_code=status.HTTP_200_OK)
async def remove_volunteer_from_opportunity(
    opportunity_id: str,
    volunteer_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
        Authenticate and enforce admin for current user
        Remove a volunteer from an opportunity
        return update opportunity
    """

    # Validate User:
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Query for the opportunity
    opportunity = await db.volunteeropportunities.find_unique(
        where={
            "id": opportunity_id,
            "volunteerIDs": {
                "has": volunteer_id
            }
        }
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Unable to located opportunity with enrolled volunteer"
        )

    try:
        # remove volunteer
        updated_volunteers = [id for id in opportunity.volunteerIDs if id != volunteer_id]

        updated_opportunity = await db.volunteeropportunities.update(
            where={"id": opportunity_id},
            data={
                "volunteerIDs": updated_volunteers
            }
        )

        return {"Updated Ppportunity": updated_opportunity}
    except:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to remove volunteer from opportunity"
        )
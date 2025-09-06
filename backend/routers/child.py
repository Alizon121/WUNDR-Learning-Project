from fastapi import APIRouter, status, Depends, HTTPException
from backend.db.prisma_client import db
from typing import Annotated
from backend.models.user_models import User, ChildCreate, ChildUpdate
from backend.models.interaction_models import EmergencyContactCreate
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from .auth.login import get_current_user
from .auth.utils import enforce_authentication, enforce_admin


router = APIRouter()


# ! Create Child
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_child(
    # apply Pydantic model for data validation
    child_data: ChildCreate,
    current_user: Annotated[User, Depends(get_current_user)]

):

    # Make sure the user is authenticated
    enforce_authentication(current_user, "add a child")

    # print("THIS IS THE PARENTID:", current_user.id)

    # Add the child
    try:
        created_child = await db.children.create(
            data={
                "firstName": child_data.firstName,
                "lastName": child_data.lastName,
                "homeschool": child_data.homeschool,
                "birthday": child_data.birthday,
                "parentIDs": [current_user.id], # Add the current user's ID to parentIDs
                "eventIDs": [], # Create activityIDs array so we can easily add to it later
                "createdAt": child_data.createdAt,
                "updatedAt": child_data.updatedAt
            },
        )

        # Once we create the child, update the current user to include the new child
        updated_user = await db.users.update(
            where={"id": current_user.id},
            data={
                "childIDs": {
                    "push": created_child.id
                }
            },
            include={
                "children": True
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create child: {str(e)}"
        )

    # payload = {
    #     "child": created_child,
    #     "parent": updated_user,
    #     "message": "Child added successfully"
    # }

    # return JSONResponse(
    #     status_code=201,
    #     content=jsonable_encoder(payload)
    # )
    return {"child": created_child, "parent": updated_user, "message": "Child added successfully"}

# ! Get Children of the Current User
@router.get("/current", status_code=status.HTTP_200_OK)
async def get_children(
    current_user: Annotated[User, Depends(get_current_user)]
):
    print("current_user:", getattr(current_user, "id", None))

    enforce_authentication(current_user, "view your children.")

    children = await db.children.find_many(
        where={
            "parentIDs":{
                "has": current_user.id
            }
        }
    )
    return children


# ! Get Child by ID
@router.get("/{child_id}", status_code=status.HTTP_200_OK)
async def get_child_by_id(
    child_id: str,
    # Get the current user for security
    current_user: Annotated[User, Depends(get_current_user)]
):

    enforce_authentication(current_user, "access your child's information")

    child = await db.children.find_unique(
        where={"id": child_id},
        include={
            # Include the child's parents and their events
            "parents": True,
            "events": True
        }
    )

    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Child not found."
        )

    # If the current user is not a parent of the child, throw a 403
    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    return child

# ! Get children of an event
@router.get("/event", status_code=status.HTTP_200_OK)
async def get_children_of_event(
    eventId: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Get the children for an event
        Is only for admin
    """

    # Authenticate
    enforce_authentication(current_user)

    # Check if admin
    enforce_admin(current_user)

    try: 
        # Query for all children of event
        children = await db.children.find_many(
            where= {
                "eventIDs": {eventId}
            }
        )

    except:
        raise HTTPException(
            status_code=400,
            detail="Children not found"
        )
    
    return children


# ! Update Child
@router.patch("/{child_id}", status_code=status.HTTP_200_OK)
async def update_child(
    child_id: str,
    # use ChildUpdate pydantic model for data validation
    update_data: ChildUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):

    # Make sure the user is authenticated
    enforce_authentication(current_user, "update your child's information")

    # Fetch the child
    child = await db.children.find_unique(
        where={"id": child_id}
    )

    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Child not found."
        )

    # Make sure the current user is a parent of the child
    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    # Make the update
    updated_child = await db.children.update(
        where={"id": child.id},
        # exclude any fields that were not included in the payload
        data=update_data.model_dump(exclude_unset=True),
        include={
            "parents": True,
            "events": True
        }
    )

    return {
        "child": updated_child,
        "message": "Child updated successfully"
    }


# ! Delete Child
@router.delete("/{child_id}", status_code=status.HTTP_200_OK)
async def delete_child(
    child_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):

    # Make sure the user is authenticated
    enforce_authentication(current_user, "remove your child")

    # Fetch the child
    child = await db.children.find_unique(
        where={"id": child_id}
    )

    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child not found."
        )

    # Make sure the current usr is a parent of the child
    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    # Delete the child
    await db.children.delete(
        where={"id": child_id}
    )

    # Remove the child ID from the parent document
    parent = await db.users.find_unique(where={"id": current_user.id})
    # Remove the current child's ID from the parent's 'childIDs' array
    updated_childIDs = [cid for cid in parent.childIDs if cid != child_id]

    updated_user = await db.users.update(
        where={"id": current_user.id},
        data={"childIDs": updated_childIDs},
        include={"children": True}
    )

    return {
        "message": "Child deleted successfully.",
        "parent": updated_user
    }

@router.get("/ping")
async def ping():
    print("PING /child/__ping")
    return {"ok": True}

# Emergency Contact Routes =================================================

@router.post("/{child_id}", status_code=status.HTTP_201_CREATED)
async def create_emergency_contact(
    child_id: str,
    emergency_contact_data: EmergencyContactCreate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
        Authenticate the user
        Create Emergency Contact for Child
    """


    # User validations
    enforce_authentication(current_user, "Create emergency contact")

    # Verify that the child exists
    child = await db.children.find_unique(
        where={"id": child_id},
        include={"parents": True}
    )

    if not child:
        raise HTTPException(
            status_code=404,
            detail="Child not found"
        )
    
    # Check if current user is a guardian/parent of this child
    user_is_guardian = any(parent.id == current_user.id for parent in child.parents)
    if not user_is_guardian:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to create emergency contacts for this child"
        )

    # Validate priority range (assuming 1-10 is acceptable range)
    if not (1 <= emergency_contact_data.priority <= 3):
        raise HTTPException(
            status_code=400,
            detail="Priority must be between 1 and 3"
        )
    
    # Check for priority conflicts (if you want unique priorities per child)
    existing_priority = await db.emergencycontact.find_first(
        where={
            "childId": child_id,
            "priority": emergency_contact_data.priority
        }
    )
    if existing_priority:
        raise HTTPException(
            status_code=409,
            detail=f"Priority {emergency_contact_data.priority} is already assigned to another emergency contact for this child"
        )

    try:

        existing_contact = await db.emergencycontact.find_first(
            where={
                "firstName": emergency_contact_data.firstName,
                "lastName": emergency_contact_data.lastName,
                "phoneNumber": emergency_contact_data.phoneNumber,
            }
        )
        
        if existing_contact:
            # Check if this emergency contact is already linked to this child
            existing_relationship = await db.emergencycontact.find_first(
                where={
                    "childId": child_id,
                    "contactId": existing_contact.id
                }
            )
            
            if existing_relationship:
                raise HTTPException(
                    status_code=409,
                    detail="This emergency contact already exists for this child"
                )
            
            # Create the relationship with existing contact
            relationship = await db.emergencycontact.create(
                data={
                    "childId": child_id,
                    "contactId": existing_contact.id,
                    "priority": emergency_contact_data.priority
                }
            )

            return {
                "emergencyContact": existing_contact,
                "relationship": relationship,
                "message": "Linked existing emergency contact to child"
            }
            
        else:
            new_contact = await db.emergencycontact.create(
                data={
                    "firstName": emergency_contact_data.firstName,
                    "lastName": emergency_contact_data.lastName,
                    "phoneNumber": emergency_contact_data.phoneNumber,
                    "relationship": emergency_contact_data.relationship,
                    "priority": emergency_contact_data.priority
                    }
            )
            return {
                    "emergencyContact": new_contact,
                    "relationship": relationship,
                    "message": "Created new emergency contact for child"
                    }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Failed to create emergency contact'
        )
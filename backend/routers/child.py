from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User, ChildCreate
from .auth.login import get_current_user

router = APIRouter()

# ! Create Child
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_child(
    child_data: ChildCreate, # apply Pydantic model for data validation
    current_user: Annotated[User, Depends(get_current_user)]

):
    try:
        created_child = await db.children.create(
            data={
                "firstName": child_data.firstName,
                "lastName": child_data.lastName,
                "homeschool": child_data.homeschool,
                "age": child_data.age,
                "parentIDs": [current_user.id], # Add the urrent user's ID to parentIDs
                "activityIDs": [] # Create activityIDs array so we can easily add to it later
            },
            include={
                "parents": True, # Include the current user in the child's 'parents' array
            }
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

    return {"child": created_child, "parent": updated_user, "message": "Child added successfully"}


# ! Get Children of the Current User
@router.get("/current", status_code=status.HTTP_200_OK)
async def get_children(
    current_user: Annotated[User, Depends(get_current_user)]
):
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

    child = await db.children.find_unique(
        where={"id": child_id},
        include={
            # Include the child's parents and their activities
            "parents": True,
            "activities": True
        }
    )

    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Child with ID {child_id} not found."
        )

    # If the current user is not a parent of the child, throw a 403
    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    return child

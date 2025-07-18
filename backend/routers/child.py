from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User, ChildCreate, ChildUpdate
from .auth.login import get_current_user


router = APIRouter()


# ! Create Child
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_child(
    # apply Pydantic model for data validation
    child_data: ChildCreate,
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
            detail=f"Child not found."
        )

    # If the current user is not a parent of the child, throw a 403
    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    return child


# ! Update Child
@router.patch("/{child_id}", status_code=status.HTTP_200_OK)
async def update_child(
    child_id: str,
    # use ChildUpdate pydantic model for data validation
    update_data: ChildUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):
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
            "activities": True
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

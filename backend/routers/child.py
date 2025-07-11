from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User, Child, ChildCreate
from .auth.login import get_current_user

router = APIRouter()

# ! Create Child
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_child(
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

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create child: {str(e)}"
        )

    return {"child": created_child, "message": "Child added successfully"}

@router.get("/childrenOfCurrentUser", status_code=status.HTTP_200_OK)
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

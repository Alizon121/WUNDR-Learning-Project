from fastapi import APIRouter, status, Depends
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from .auth.login import get_current_active_user

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK)
async def get_children(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    children = await db.children.find_many(
        where={
            "parentIDs":{
              "has": current_user.id
            }
        }
    )
    return children
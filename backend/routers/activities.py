from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from models.interaction_models import ActivityCreate


router = APIRouter()


# ! Create Activity
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_activity(activity_data: ActivityCreate):
    return await db.activities.create(data=activity_data.dict())


# ! Get All Activities


# ! Get Activity by ID


# ! Update Activity


# ! Delete Activity


# ! Add Event to Activity (??)

from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import EventCreate
from .auth.login import get_current_user


router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Create Event

    Verify authentication
    Link the event to an existing activity
    Attach users / children by their IDs
    Return the created event
    """

    # Verify authentication
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized. You must be authenticated to create an event."
        )

    # Verify that the activity ID is valid
    activity = await db.activities.find_unique(where={
        "id": event_data.activityId
    })

    if not activity:
        raise HTTPException(
            status_code=404,
            detail="Activity not found."
        )

    # Verify that the userIDs and childIDs are valid
    valid_users = await db.users.find_many(
        where={"id": {"in": event_data.userIds}}
    )

    if len(valid_users) != len(event_data.userIds):
        raise HTTPException(
            status_code=400,
            detail="One or more user IDs are invalid."
        )

    valid_children = await db.children.find_many(
        where={"id": {"in": event_data.childIds}}
    )

    if len(valid_children) != len(event_data.childIds):
        raise HTTPException(
            status_code=400,
            detail="One or more child IDs are invalid."
        )

    # Create the event
    try:
        new_event = await db.events.create(
            data={
                "activityId": event_data.activityId,
                "userIDs": event_data.userIds,
                "childIDs": event_data.childIds,
                "createdAt": event_data.createdAt,
                "updatedAt": event_data.updatedAt

            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

    return {"event": new_event, "message": "Event created successfully"}

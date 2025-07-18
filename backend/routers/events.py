from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import EventCreate, EventUpdate
from .auth.login import get_current_user
from .auth.utils import enforce_admin
from datetime import datetime


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

    enforce_admin(current_user, "create an event")

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


@router.get("", status_code=status.HTTP_200_OK)
async def get_all_events(
    skip: int = 0,
    limit: int = 10
):

    """
    Get All Events

    Returns every event in the system
    Applies pagination
    """

    try:
        events = await db.events.find_many(
            skip=skip,
            take=limit,
            order={"createdAt": "desc"}
        )
        return {"events": events}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch events: {str(e)}"
        )


@router.get("/{event_id}", status_code=status.HTTP_200_OK)
async def get_event_by_id(event_id: str):

    """
    Get Event by ID

    Fetches an event by its ID
    Hydrates the event with its user/children/activity data
    """

    try:
        # Fetch the event
        event = await db.events.find_unique(where={"id": event_id})

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )

        # Query for related data
        users = await db.users.find_many(where={"id": {"in": event.userIDs}})
        children = await db.children.find_many(where={"id": {"in": event.childIDs}})
        activity = await db.activities.find_unique(where={"id": event.activityId})
        reviews = await db.reviews.find_many(where={"eventId": event.id})

        # Add the data to the event
        hydrated_event = {
            **event.dict(),
            "users": users,
            "children": children,
            "activity": activity,
            "reviews": reviews
        }

        return hydrated_event

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch event: {str(e)}"
        )


@router.patch("/{event_id}", status_code=status.HTTP_200_OK)
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):

    """
    Update Event

    Verify authentication
    Verify admin status
    Find the existing event
    Validate data if necessary (if updating userIDs, childIDs, activityID)
    Update the event
    """

    # Make sure the user is authenticated
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized. You must be authenticated to update an event."
        )

    # Verify admin status
    enforce_admin(current_user, "update an event")

    # Find the event
    event = await db.events.find_unique(where={"id": event_id})

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    # Validate user, child, and activity IDs
    if event_data.userIds:
        users = await db.users.find_many(where={"id": {"in": event_data.userIds}})
        if len(users) != len(event_data.userIds):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One mor more user IDs are invalid"
            )

    if event_data.childIds:
        children = await db.children.find_many(where={"id": {"in": event_data.childIds}})
        if len(children) != len(event_data.childIds):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more child IDs is invalid"
            )

    if event_data.activityId:
        activity = await db.activities.find_unique(where={"id": event_data.activityId})
        if not activity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Activity ID is invalid"
            )

    # Prepare the update data and update the event
    update_payload = {}

    if event_data.activityId is not None:
        update_payload["activityId"] = event_data.activityId

    if event_data.userIds is not None:
        update_payload["userIDs"] = event_data.userIds

    if event_data.childIds is not None:
        update_payload["childIDs"] = event_data.childIds

    update_payload["updatedAt"] = datetime.utcnow()

    print(event_data.dict(exclude_unset=True))

    updated_event = await db.events.update(
        where={"id": event_id},
        data=update_payload
    )

    return {"event": updated_event, "message": "Event updated successfully"}

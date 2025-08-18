from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from backend.db.prisma_client import db
from typing import Annotated
from backend.models.user_models import User
from backend.models.interaction_models import EventCreate, EventUpdate, ReviewCreate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication
from datetime import datetime
from .notifications import send_email_one_user, schedule_reminder, send_email_multiple_users

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

    enforce_authentication(current_user, "create an event")

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
                "name": event_data.name,
                "description": event_data.description,
                "date": event_data.date,
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
    limit: int = 10,
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
    enforce_authentication(current_user, "update an event")

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

    if event_data.name is not None:
        update_payload["name"] = event_data.name

    if event_data.description is not None:
        update_payload["description"] = event_data.description

    if event_data.date is not None:
        update_payload["date"] = event_data.date

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


@router.delete("/{event_id}", status_code=status.HTTP_200_OK)
async def delete_event_by_id(
    event_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):

    """
    Delete Event

    Verify authentication
    Verify admin status
    Verify that the event exists
    Delete the event
    """

    # Make sure the user is authenticated
    enforce_authentication(current_user, "delete an event")

    # Verify admin status
    enforce_admin(current_user, "delete an event")

    # Verify that the event exists
    event = await db.events.find_unique(
        where={"id": event_id},
        include={"users": True}
        )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Get all the emails associated with an event as list
    users =  event.users
    user_emails = [user.email for user in users]

    # Send the email notification to users
    subject = f'Wonderhood: {event.name} Cancellation'
    contents = f'Hello,\n\nWe regret to inform you that the {event.name} event on {event.date} has been cancelled. Please take a look at our website for upcoming events.\n\n Best,\n\n Wonderhood Team'

    background_tasks.add_task(
        send_email_multiple_users,
        user_emails,
        subject,
        contents
    )

    # Delete the event
    await db.events.delete(where={"id": event_id})

    return {"message": "Event deleted successfully"}

@router.patch("/{event_id}/join", status_code=status.HTTP_200_OK)
async def add_user_to_event(
    event_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):

    """
    Add the current user to an existing event

    Verify authentication
    Fetch the event
    Check if user is already enrolled
    If not, add user to event
    Return success message
    """

    # Make sure the current user is authenticated
    enforce_authentication(current_user, "join an event")

    # Fetch the event
    event = await db.events.find_unique(where={"id": event_id})

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found")

    # Check if user is already enrolled
    if current_user.id in event.userIDs:
        raise HTTPException(
            status_code=400,
            detail="User is already enrolled"
        )

    # Add the user to the event
    updated_event = await db.events.update(
        where={"id": event_id},
        data={"userIDs": event.userIDs + [current_user.id]}
    )

    # Create notification
    subject = f"Enrollment Confirmation: {event.name}"
     # ? ADD link to make changes still
    contents = f'This email confirms that you are enrolled for the {event.name} event on {event.date}. If you are no longer available to join the event, please make changes here: .\n\nBest,\n\nWondherhood Team'

    background_tasks.add_task(
        send_email_one_user,
        current_user.email,
        subject,
        contents
    )

    await db.notifications.create(
        data={
            "description": f"Confirmation for event {event.name}",
            "userId": current_user.id
        }
    )

    # Schedule the one-day reminder
    background_tasks.add_task(
        schedule_reminder,
        current_user.id,
        event_id,
        event.date
    )

    return {"event": updated_event, "message": "User added to event and notified"}

@router.patch("/{event_id}/enroll", status_code=status.HTTP_200_OK)
async def add_child_to_event(
    event_id: str,
    child_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):

    """
    Add a child to an event

    Validate authentication
    Fetch the event
    Verify that current user is a parent of the child
    Check to see if child is already enrolled
    Add child to event
    Return success message
    """

    # Make sure the current user is authenticated
    enforce_authentication(current_user, "enroll a child in an event")

    # Fetch the event
    event = await db.events.find_unique(where={"id": event_id})

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found")

    # Fetch child and verify parenthood
    child = await db.children.find_unique(
        where={"id": child_id}
    )

    if not child:
        raise HTTPException(
            status_code=404,
            detail="Child not found"
        )

    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=403,
            detail="You are not the parent of this child."
        )

    # Check if child is already enrolled
    if child.id in event.childIDs:
        raise HTTPException(
            status_code=400,
            detail="Child is already enrolled"
        )

    # Add child to event
    updated_event = await db.events.update(
        where={"id": event_id},
        data={"childIDs": event.childIDs + [child.id]}
    )

    # Create notification
    subject = f'Enrollment Confirmation: {event.name}'
    content = f'Hello,\n\nThis email confirms that your child has been enrolled for the {event.name} event at Wonderhood for {event.date}.\n\nWe look forward to see you there!\n\nBest,\n\nWonderhood Team'

    background_tasks.add_task(
        send_email_one_user,
        current_user.email,
        subject,
        content
    )

    await db.notifications.create(
        data= {
            "description": f"Confirmation for event {event.name}",
            "userId": current_user.id
        }
    )

    # Schedule the one-day reminder
    background_tasks.add_task(
        schedule_reminder,
        current_user.id,
        event_id,
        event.date
    )

    return {"event": updated_event, "message": "Child added to event and user notified"}

@router.patch("/{event_id}/leave", status_code=status.HTTP_200_OK)
async def remove_user_from_event(
    event_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):

    """
    Remove the current user from an event

    Verify authentication
    Fetch the event
    Check that user is enrolled
    Remove the user from the event
    Return success message
    """

    # Make sure the current user is authenticated
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized. You must be authenticated to delete an event."
        )

    # Fetch the event
    event = await db.events.find_unique(where={"id": event_id})

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found")

    # Check if user is enrolled
    if current_user.id not in event.userIDs:
        raise HTTPException(
            status_code=400,
            detail="User is not enrolled"
        )
    
    # Send notification to User that they have been removed from event
    subject = f'Unenrollment Confirmation: {event.name}'
    content = f'Hello,\n\nThis email confirms that you have been unenrolled from the {event.name} event at Wonderhood on {event.date}. Please find more events at our website.\n\nBest,\n\nWonderhood Team'
    
    background_tasks.add_task(
        send_email_one_user,
        current_user.email,
        subject,
        content
    )

    # Remove the user from the event
    updated_user_list = [uid for uid in event.userIDs if uid != current_user.id]

    updated_event = await db.events.update(
        where={"id": event_id},
        data={"userIDs": updated_user_list}
    )

    return {"event": updated_event, "message": "User removed from event"}


#! Change this endpoint to PUT instead of DELETE?
@router.patch("/{event_id}/unenroll", status_code=status.HTTP_200_OK)
async def remove_child_from_event(
    event_id: str,
    child_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):

    """
    Remove a child from an event

    Validate authentication
    Fetch the event
    Verify that current user is a parent of the child
    Confirm that the child is enrolled
    Remove child from event
    Return success message
    """

    # Make sure the current user is authenticated
    enforce_authentication(current_user, "unenroll a child from an event")

    # Fetch the event
    event = await db.events.find_unique(where={"id": event_id})

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found")

    # Fetch child and verify parenthood
    child = await db.children.find_unique(
        where={"id": child_id}
    )

    if not child:
        raise HTTPException(
            status_code=404,
            detail="Child not found"
        )

    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=403,
            detail="You are not the parent of this child."
        )

    # Check if child is enrolled
    if child.id not in event.childIDs:
        raise HTTPException(
            status_code=400,
            detail="Child is not enrolled"
        )
    
    # Notification to user for unenrolling child
    subject = f'Unenrollment Confirmation: {event.name}'
    content = f'Hello,\n\nThis email confirms that your child has been unenrolled from the {event.name} on {event.date}. Please find more events on our website.\n\nBest,\n\nWonderhood Team'
    
    background_tasks.add_task(
        send_email_one_user,
        current_user.email,
        subject,
        content
    )

    # Remove child from event
    updated_child_list = [id for id in event.childIDs if id != child.id]

    updated_event = await db.events.update(
        where={"id": event_id},
        data={"childIDs": updated_child_list}
    )

    return {"event": updated_event, "message": "Child removed from event"}


########### * Review endpoint(s) ###############

@router.get("/{event_id}/reviews", status_code=status.HTTP_200_OK)
async def get_all_reviews_by_event(
    event_id: str,
    skip: int = 0,
    limit: int = 10
):

    """
    GET all paginated reviews for an event
    """

    try:
        reviews = await db.reviews.find_many(
            where={ "eventId": event_id},
             # TODO Ensure pagination is working
                skip=skip,
                take=limit
        )

        if not reviews:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reviews not found"
            )

        return {"reviews": reviews}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to obtain reviews"
        )

@router.get('/{event_id}/review/{review_id}', status_code=status.HTTP_200_OK)
async def get_review_by_id(
     event_id: str,
     review_id: str,
    #  current_user: Annotated[User, Depends(get_current_user)]
    ):

    """
     Get review by id
    """

    try:
        # Get a review
        review = await db.reviews.find_unique(
            where={
                "id": review_id,
            }
        )

        if not review or review.eventId != event_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found for this event"
            )

        return {"review": review}

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to obtain review"
        )

@router.post("/{event_id}/reviews", status_code=status.HTTP_201_CREATED)
async def create_review(
     event_id: str,
     review_data: ReviewCreate,
     current_user: Annotated[User, Depends(get_current_user)]
):
     """
        Create Review

        Get the current user for authentication and create review
     """

     enforce_authentication(current_user, "leave a review")

     event = await db.events.find_unique(
            where={"id": event_id}
        )

     if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )


    # ! Do we need to add logic for preventing one user making many reviews?
     existing_review = await db.reviews.find_first(
         where={
             "eventId": event_id,
             "parentId": current_user.id
            }
     )

     if existing_review:
         raise HTTPException(
             status_code=status.HTTP_400_BAD_REQUEST,
             detail="User cannot make more than one review for an event."
         )

     try:
          review = await db.reviews.create(
               data={
                    "eventId": review_data.eventId,
                    "parentId": current_user.id,
                    "rating": review_data.rating,
                    "description": review_data.description,
                    "createdAt": datetime.utcnow()
               }
          )
          return {
            "review": review,
            "message": "Review successfully made"
            }

     except Exception as e:
          raise HTTPException(
               status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
               detail=f'Failed to create review: {e}'
          )
     
# * =============================================
# Add the Jobs routes here
# Add a message on UI noting to look for correspondences from us in their spam folder
# Should I make a one-to-many rellationship between Jobs and Users
# Jobs and Children? If a User or child is removed from an event, then the User should not get the reminder
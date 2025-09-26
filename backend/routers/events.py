from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from backend.db.prisma_client import db
from typing import Annotated
from backend.models.user_models import User
from backend.models.interaction_models import EventCreate, EventUpdate, ReviewCreate, EnrollChildren, NotificationCreate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication
from datetime import datetime, timezone
from .notifications import send_email_one_user, schedule_reminder, send_email_multiple_users

router = APIRouter()

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
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
        where={"id": {"in": event_data.userIDs}}
    )

    if len(valid_users) != len(event_data.userIDs):
        raise HTTPException(
            status_code=400,
            detail="One or more user IDs are invalid."
        )

    valid_children = await db.children.find_many(
        where={"id": {"in": event_data.childIDs}}
    )

    if len(valid_children) != len(event_data.childIDs):
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
                "image": event_data.image,
                "participants": event_data.participants,
                "limit": event_data.limit,
                "city": event_data.city,
                "state": event_data.state,
                "address": event_data.address,
                "zipCode": event_data.zipCode,
                "latitude": event_data.latitude,
                "longitude": event_data.longitude,
                "startTime": event_data.startTime,
                "endTime": event_data.endTime,
                "volunteerLimit": event_data.volunteerLimit,
                "activityId": event_data.activityId,
                "userIDs": event_data.userIDs,
                "childIDs": event_data.childIDs,
                "createdAt": event_data.createdAt,
                "updatedAt": event_data.updatedAt

            }
        )

        # Send the email notification to all users upon event creation
        users = await db.users.find_many()
        user_emails = [user.email for user in users]

        subject = f'Check Out Our New Event at Wonderhood: {new_event.name}'
        contents = f'Hello,\n\n Check out our new event at Wonderhood. We hope to see you there.\n\nBest,\n\nWonderhood Team'

        background_tasks.add_task(
            send_email_multiple_users,
            user_emails,
            subject,
            contents
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

    return {"event": new_event, "message": "Event created successfully"}


@router.get("", status_code=status.HTTP_200_OK)
async def get_all_events(
    # skip: int = 0,
    # limit: int = 10,
):

    """
    Get All Events

    Returns every event in the system
    Applies pagination
    """

    try:
        events = await db.events.find_many(
            # skip=skip,
            # take=limit,
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
        event = await db.events.find_unique(
            where={"id": event_id},
            include={
                "reviews": True,
                "users": True,
                "activity": True,
                "children": True
            }
        )

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )

        return event

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch event: {str(e)}"
        )


@router.patch("/{event_id}", status_code=status.HTTP_200_OK)
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
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
    if event_data.userIDs:
        users = await db.users.find_many(where={"id": {"in": event_data.userIDs}})
        if len(users) != len(event_data.userIDs):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more user IDs are invalid"
            )

    if event_data.childIDs:
        children = await db.children.find_many(where={"id": {"in": event_data.childIDs}})
        if len(children) != len(event_data.childIDs):
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

    if event_data.image is not None:
        update_payload["image"] = event_data.image

    if event_data.participants is not None:
        update_payload["participants"] = event_data.participants

    if event_data.limit is not None:
        update_payload["limit"] = event_data.limit

    if event_data.city is not None:
        update_payload["city"] = event_data.city

    if event_data.state is not None:
        update_payload["state"] = event_data.state

    if event_data.address is not None:
        update_payload["address"] = event_data.address

    if event_data.zipCode is not None:
        update_payload["zipCode"] = event_data.zipCode

    if event_data.latitude is not None:
        update_payload["latitude"] = event_data.latitude

    if event_data.longitude is not None:
        update_payload["longitude"] = event_data.longitude

    if event_data.startTime is not None:
        update_payload["startTime"] = event_data.startTime

    if event_data.endTime is not None:
        update_payload["endTime"] = event_data.endTime

    if event_data.volunteerLimit is not None:
        update_payload["volunteerLimit"] = event_data.volunteerLimit

    if event_data.activityId is not None:
        update_payload["activityId"] = event_data.activityId

    if event_data.userIDs is not None:
        update_payload["userIDs"] = event_data.userIDs

    if event_data.childIDs is not None:
        update_payload["childIDs"] = event_data.childIDs

    update_payload["updatedAt"] = datetime.utcnow()

    # print(event_data.dict(exclude_unset=True))

    updated_event = await db.events.update(
        where={"id": event_id},
        data=update_payload
    )

    # Send email notification for event date update
    user_IDs =  event.userIDs
    users = await db.users.find_many(
        where={"id": {"in": user_IDs}}
    )

    user_emails = [user.email for user in users]

    # ? Add link to contents for having a user make changes to their event enrollment.
    if update_payload.get("name") and update_payload.get("date"):
        subject = f'Wonderhood: {update_payload["name"]} Update'
        contents = f'Hello,\n\nThe {update_payload["name"]} has been rescheduled to {update_payload["date"]}. We hope to see you there!\n\n Best,\n\n Wonderhood Team'
    elif update_payload.get("date") and not update_payload.get("name"):
        subject = f'Wonderhood: {event.name} Update'
        contents = f'Hello,\n\nThe {event.name} has been rescheduled to {update_payload["date"]}. We hope to see you there!\n\n Best,\n\n Wonderhood Team'
    elif update_payload.get("name") and not update_payload.get("date"):
        subject = f'Wonderhood: {update_payload["name"]} Update'
        contents = f'Hello,\n\nThe {update_payload["name"]} has been rescheduled to {event.date}. We hope to see you there!\n\n Best,\n\n Wonderhood Team'
    else:
        subject = f'Wonderhood: {event.name} Update'
        contents = f'Hello,\n\nThe {event.name} has been rescheduled to {event.date}. We hope to see you there!\n\n Best,\n\n Wonderhood Team'

    background_tasks.add_task(
        send_email_multiple_users,
        user_emails,
        subject,
        contents
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
    like a volunteer

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
        data={
            "users": {"connect": {"id": current_user.id}},
            "participants": {"increment": 1}
            }
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
            "title": subject,
            "description": f"Confirmation for event {event.name}",
            "userId": current_user.id,
            "isRead": False,
            "time": event.date,
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
async def add_children_to_event(
    event_id: str,
    payload: EnrollChildren,
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

    incoming_ids = set(payload.childIDs)
    existing_ids = set(event.childIDs or [])

    to_add = list(incoming_ids - existing_ids)
    if not to_add:
        return {
            "event": event,
            "message": "No new children to enroll"
        }

    # validate existing children
    children = await db.children.find_many(
        where={"id": {"in": to_add}}
    )
    found_ids = {c.id for c in children}
    missing = set(to_add) - found_ids
    if missing:
        raise HTTPException(status_code=404, detail=f"Child not found: {', '.join(missing)}")

    # validate parenthood
    for c in children:
        if current_user.id not in (c.parentIDs or []):
            raise HTTPException(
                status_code=403,
                detail="You are not the parent of this child."
            )

    # Add children to event
    updated_event = await db.events.update(
        where={"id": event_id},
           data={
            "children": {"connect": [{"id": cid} for cid in to_add]},
            "participants": {"increment": len(to_add)}
            }
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
            "title": subject,
            "description": f"Confirmation for event {event.name}",
            "userId": current_user.id,
            "isRead": False,
            "time": event.date,
            # "icon": icon
        }
    )

    # Schedule the one-day reminder
    background_tasks.add_task(
        schedule_reminder,
        current_user.id,
        event_id,
        event.date
    )

    return {"event": updated_event, "message": "Children added to event and user notified"}

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

    # ! Create logic for deleting the previous notification?

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
          data={
            "userIDs": updated_user_list,
            "participants": {"decrement":1}
            }
    )

    return {"event": updated_event, "message": "User removed from event"}



@router.patch("/{event_id}/unenroll", status_code=status.HTTP_200_OK)
async def remove_child_from_event(
    event_id: str,
    # child_id: str,
    payload: EnrollChildren,
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

    selected_ids = set(payload.childIDs or [])
    if not selected_ids:
        return {
            "event": event,
            "message": "No children selected to unenroll"
        }

    existing_ids = set(event.childIDs or [])

    to_remove = list(selected_ids & existing_ids)
    if not to_remove:
        return {
            "event": event,
            "message": "Selected children are not enrolled"
        }

    # validate existing children
    children = await db.children.find_many(
        where={"id": {"in": to_remove}}
    )
    found_ids = {c.id for c in children}
    missing = set(to_remove) - found_ids
    if missing:
        raise HTTPException(status_code=404, detail=f"Child not found: {', '.join(missing)}")

    # validate parenthood
    for c in children:
        if current_user.id not in (c.parentIDs or []):
            raise HTTPException(
                status_code=403,
                detail="You are not the parent of this child."
            )

    # Remove child from event
    updated_child_list = [cid for cid in (event.childIDs or []) if cid not in to_remove]

    updated_event = await db.events.update(
        where={"id": event_id},
         data={
            "children": {"disconnect": [{"id": cid} for cid in to_remove]},
            "childIDs": updated_child_list,
            "participants": {"decrement": len(to_remove)}
            }
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

    # ! Add logic to delete notification?


    return {"event": updated_event, "message": f"Removed {len(to_remove)} child(ren) from event"}


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

########### * Notification endpoint(s) ###############
# Have admin send a message to the users of children of an event
@router.post("/{event_id}/notification/enrolled_users_child", status_code=status.HTTP_200_OK)
async def send_message_to_users_of_enrolled_child(
    current_user: Annotated[User, Depends(get_current_user)],
    event_id:str,
    notification: NotificationCreate,
    # title: str,
    # description: str,
    # icon: str,
    background_tasks: BackgroundTasks
):
    """
        Send a message to users of enrolled children
        Authentication and Admin Role Required
    """

    # Check for admin
    enforce_authentication(current_user, "send notification")

    enforce_admin(current_user, "send notification")

    # Query for the parents of children
    event = await db.events.find_unique(
        where={"id": event_id},
        include={"children": {
                     "include":{
                        "parents": True
                        }
                     }
                 }
    )

    if not event:
        raise HTTPException(status_code=404, detail="Unable to obtain event")

    # Add the parent IDs to a set
    parent_ids = set()
    for child in event.children:
        parent_ids.update(child.parentIDs)

    if not parent_ids:
        raise HTTPException(status_code=404, detail="Unable to obtain parent IDs")

    # Query for the parents' email(s)
    parent_emails = list()
    for id in parent_ids:
        users = await db.users.find_unique(
            where={"id": id}
        )
        parent_emails.append(users.email)

    if not parent_emails:
        raise HTTPException(status_code=404, detail="Unable to obtain parent emails")

    # Creat the notifications for the UI
    notification_data = [
        {
        "title": notification.title,
        "description": notification.description,
        "userId": id,
        "isRead": False,
        "time": event.date,
        # "icon": icon
        }
        for id in parent_ids
    ]

    new_notification = await db.notifications.create_many(
        data=notification_data
    )

    # Send the email
    background_tasks.add_task(
        send_email_multiple_users,
        parent_emails,
        notification.title,
        notification.description
    )


    return {
        "message": "Notification successfully sent to all parents",
        "notification": new_notification
            }

# Have admin send a message to the users enrolled in  an event
@router.post("/{eventId}/notification/enrolled_user", status_code=status.HTTP_200_OK)
async def send_enrolled_user_notification(
    eventId: str,
    subject: str,
    content: str,
    # icon: str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):
    """
        Send notifications to all users enrolled in an event
    """

    enforce_authentication(current_user, "create notification")
    enforce_admin(current_user, "create notification")

    # Find users enrolled in an event
    event = await db.events.find_unique(
        where={"id": eventId}
    )

    if not event:
        raise HTTPException(status_code=404, detail="Unable to locate event")

    # Create notification instance
    notification_data = [
        {
        "title": subject,
        "description": content,
        "userId": id,
        "isRead": False,
        "time": event.date,
        # "icon": icon
        }
        for id in event.userIDs
    ]

    notification = await db.notifications.create_many(
        data=notification_data
    )

    # create email notification
    users_emails = list()
    for id in event.userIDs:
        users = await db.users.find_unique(
            where={"id":id}
        )
        users_emails.append(users.email)

    background_tasks.add_task(
        send_email_multiple_users,
        users_emails,
        subject,
        content
    )

    return {
        "Message": "Notification successfully made",
        "Notification": notification
        }

########### * Volunteer endpoint(s) ###############
# for specific event, when volunteer enrolls --> volunteer is added to event and volunteerLimit counter decrements
@router.patch("/{event_id}/volunteer_signup")
async def volunteer_signup_for_event(
    current_user: Annotated[User, Depends(get_current_user)],
    event_id: str,
    background_tasks: BackgroundTasks
):
    """
    For specific event, volunteer is added to event when enrolled and volunteerLimit counter decrements
        return event
    """

    # validate current user
    enforce_authentication(current_user)

    # validate existing event
    event = await db.events.find_unique(where={"id": event_id })
    if not event:
        raise HTTPException(status_code=401, detail="Unable to locate event")

    volunteer = await db.volunteers.find_unique(where={"userId": current_user.id})
    if not volunteer:
        raise HTTPException(status_code=401, detail="Unable to locate volunteer")

    if volunteer.status != "Approved":
        raise HTTPException(status_code=400, detail="Volunteer is not approved to sign up for an event")

    try:
        title = f"Volunteer Enrollment Confirmation: {event.name}"
        # ? ADD link to make changes still
        description = f'This email confirms that you are enrolled as a volunteer for the {event.name} event on {event.date}. If you are no longer available to join the event, please make changes here: .\n\nBest,\n\nWondherhood Team'


        notification_data =  {
                "title": title,
                "description": description,
                "userId": current_user.id,
                "isRead": False,
                "time": datetime.now(timezone.utc)
            }

        new_notification = await db.notifications.create(
                data=notification_data
            )

        background_tasks.add_task(
                send_email_one_user,
                volunteer.email,
                title,
                description
            )

        volunteer_signup = await db.events.update(
                where={"id": event_id },
                data={
                    "volunteers": {"connect": {"id": volunteer.id}},
                    "volunteerLimit": {"decrement": 1}
                }
            )

        return {
                "Volunteer": volunteer_signup,
                "Notification": new_notification,
                "Message": "Volunteer added to event"
                }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to enroll volunteer:{e}")

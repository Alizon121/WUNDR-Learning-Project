from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from backend.models.user_models import User
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication
from typing import Annotated
from backend.db.prisma_client import db
from datetime import datetime, timedelta, timezone
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.executors.asyncio import AsyncIOExecutor
from apscheduler.jobstores.mongodb import MongoDBJobStore
from backend.models.interaction_models import NotificationUpdate, NotificationCreate
import os
import yagmail
from pymongo import MongoClient

router = APIRouter()

yagmail_app_password = os.getenv("YAGMAIL_APP_PASSWORD")
yagmail_email = os.getenv("YAGMAIL_EMAIL")
yag = yagmail.SMTP(yagmail_email, yagmail_app_password)

def send_email_one_user(
        user_email: str,
        subject: str,
        contents: str
):
    
    """
    Callback function for sending an email upon enrollment
    """
    yag.send(
        to=user_email,
        subject=subject,
        contents=contents
    )

# =======================================================

def send_email_multiple_users(
    user_emails: list[str],
    subject: str,
    contents: str
):
    """
        Call back function for sending an email to all enrolled users
    """

    for email in user_emails:
        yag.send(
            to=email,
            subject=subject,
            contents=contents
        )

# =======================================================
# * Variables for connecting APScheduler to MongoDB

MONGO_URI = os.getenv("DATABASE_URL")
mongo_client = MongoClient(MONGO_URI)

scheduler = AsyncIOScheduler(
    jobstores = {
        "mongo": MongoDBJobStore(
            client=mongo_client,
            database=os.getenv("DATABASE_NAME"),
            port=27017
        )
    }, executors={
        "default": AsyncIOExecutor()
    }
)
# =======================================================
def parse_event_date(
        raw: str | datetime
):
    """
        Helper funciton for parsing string into datetime object
    """

    if isinstance(raw, str):
        event_date = datetime.fromisoformat(raw)
    elif isinstance(raw, datetime):
        event_date = raw
    else:
         raise TypeError(f"Unsupported type for event_date: {type(raw)}")
    
    # Ensure that the date is timezone aware
    return event_date

# =======================================================
def ensure_utc(dt: datetime) -> datetime:
    """
        Helper function for checking UTC time zone
    """
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


# =======================================================
async def schedule_reminder(
        user_id: str,
        event_id: str,
        event_date: datetime
):
    """
    Callback function for handler creating a job instance and scheduling an event reminder
    """
    # Create reminder run time
    event_date = ensure_utc(parse_event_date(event_date))
    run_at = event_date - timedelta(days=1)
    if run_at <= datetime.now(timezone.utc):
        run_at = datetime.now(timezone.utc) + timedelta(seconds=10)

    # Make job record
    job = await db.jobs.create(
        data = {
            "runAt": run_at,
            "reminderType": "email",
            "status": "pending",
            "jobType": "reminder",
            "eventId": event_id
        }
    )

    scheduler.add_job(
        # lambda allows us to pass a zero-argument callable func
        # func=lambda: asyncio.run(schedule_reminder(job.id, user_id, event_id)),
        func=send_email_and_reschedule,
        trigger="date",
        run_date=run_at,
        id=job.id,
        args=[user_id, event_id, event_date, job.id]
    )

# =======================================================

async def send_email_and_reschedule(
        user_id: str,
        event_id: str,
        event_date: datetime,
        job_record_id: str
):
    """
        Callback function for actually sending the one day reminder email and updating Jobs instance
    """
    # Query user and events for writing the message subject/body
    user = await db.users.find_unique(where={"id": user_id})
    event = await db.events.find_unique(where={"id": event_id})

    subject = f"Reminder: Your Wonderhood event “{event.name}” is tomorrow"
    body = f"Hey {user.firstName},\n\nJust a quick reminder that “{event.name}” with Wonderhood happens at {event_date.isoformat()}.\n\nCheers!"
    
    # Send the email with yagmail
    yag.send(to=user.email, subject=subject, contents=body)

    # Update jobs record
    await db.jobs.update(
        where={"id": job_record_id},
        data={
            "status": "sent", 
            "sentAt": datetime.now(timezone.utc)
            }
    )

# =======================================================
def start_scheduler():
    """
        Function for calling the APScheduler
    """
    scheduler.start()


# =======================================================
@router.post("", status_code=status.HTTP_201_CREATED)
async def blast_notification(
    notification: NotificationCreate,
    # subject: str,
    # contents: str,
    # time: str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):
    """
    Create a blast message that only admin can send
    Authenticate and check admin role
    Message will be sent to all users
    """

    enforce_authentication(current_user, "create blast message")

    enforce_admin(current_user, "create blast message")

    users = await db.users.find_many()
    user_emails = [user.email for user in users]

    # Add notification here

    notification_data = [
    {
        "title": notification.title,
        "description": notification.description,
        "userId": user.id,
        "isRead": False,
        "time": notification.time,
        # "icon": icon
    }
    for user in users
]
    new_notification = await db.notifications.create_many(
        data=notification_data
    )

    background_tasks.add_task(
        send_email_multiple_users,
        user_emails,
        notification.title,
        notification.description
    )

    return {"notification": new_notification}

# =======================================================
@router.get("/", status_code=status.HTTP_200_OK)
async def get_user_notifications(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Get all notifications of a user
    Authenticate user
    """

    enforce_authentication(current_user, "retireve notifications")

    notifications = await db.notifications.find_many(
        where={"userId": current_user.id}
    )

    if not notifications:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unable to obtain notifications"
        )
    
    return {"Notifications": notifications}

@router.patch("/{notification_id}", status_code=status.HTTP_200_OK)
async def update_notification(
    notification_id: str,
    notification_data: NotificationUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Update a notification
        Verify user is authenticated and admin
    """

    # Authenticate User
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # find the notification
    notification = await db.notifications.find_unique(where={"id": notification_id})

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notificaation not found"
        )
    
    update_payload = {}

    if notification_data.title is not None:
        update_payload["title"] = notification_data.title
    if notification_data.description is not None:
        update_payload["description"] = notification_data.description
    if notification_data.isRead is not None:
        update_payload["isRead"] = notification_data.isRead
    
    updated_notification = await db.notifications.update(
        where={"id": notification_id},
        data=update_payload
    )

    return {
        "notification": updated_notification,
        "message": "Notification updated successfully"
        }
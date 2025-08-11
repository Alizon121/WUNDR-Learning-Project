from backend.db.prisma_client import db
from datetime import datetime, timedelta, timezone
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.executors.asyncio import AsyncIOExecutor
from apscheduler.jobstores.mongodb import MongoDBJobStore
import os
import yagmail
from pymongo import MongoClient

yagmail_app_password = os.getenv("YAGMAIL_APP_PASSWORD")
yagmail_email = os.getenv("YAGMAIL_EMAIL")
yag = yagmail.SMTP(yagmail_email, yagmail_app_password)

def send_email(
        user_email: str,
        event_name: str,
        event_date: str
):
    
    """
    Callback function for sending an email upon enrollment
    """
    yag.send(
        to=user_email,
        subject="Enollment Confirmation",
        # ? ADD link to make changes still
        contents=f'This email confirms that you are enrolled for the {event_name} event on {event_date}. If you are no longer available to join the event, please make changes here:.'
    )

# =======================================================

def send_email_deletion(
    user_emails: list[str],
    event_name: str,
    event_date: str,
):
    """
        Call back function for sending an email to all enrolled users upon deletion of event
    """

    for email in user_emails:
        yag.send(
            to=email,
            subject=f'Wonderhood: {event_name} Cancellation',
            contents=f'Hello,\n\nWe regret to inform you that the {event_name} event on {event_date} has been cancelled. Please take a look at our website for upcoming events.\n\n best,\n\n Wunderhood Team'
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
from db.prisma_client import db
from datetime import datetime, timedelta
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.mongodb import MongoDBJobStore
import os
import yagmail


def send_email(
        yagmail_email,
        yagmail_app_password,
        user_email: str,
        event_name: str,
        event_date: str
):
    
    """
    Callback function for sending an email upon enrollment
    """
    yag = yagmail.SMTP(yagmail_email, yagmail_app_password)
    yag.send(
        to=user_email,
        subject="Enollment Confirmation",
        # ? ADD link to make changes still
        contents=f'This email confirms that you are enrolled for the {event_name} event on {event_date}. If you are no longer available to join the event, please make changes here:.'
    )

# =======================================================
# * Variable for connecting APScheduler to MongoDB
scheduler = AsyncIOScheduler(
    jobstores = {
        "mongo": MongoDBJobStore(
            database=os.getenv("DATABASE_URL"),
            collection="apscheduler_jobs",
            host="localhost",
            port=27017
        )
    }
)


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
    run_at = event_date - timedelta(days=1)
    if run_at <= datetime.utcnow():
        run_at = datetime.utcnow() + timedelta(seconds=10)

    # Make job record
    job = await db.jobs.create({
        "data": {
            "runAt": run_at,
            "reminderType": "email",
            "status": "pending",
            "jobType": "Reminder",
            "eventId": event_id
        }
    })

    scheduler.add_job(
        # lambda allows us to pass a zero-argument callable func
        func=lambda: asyncio.create_task(schedule_reminder(job.id, user_id, event_id)),
        trigger="date",
        run_date=run_at,
        id=job.id
    )

# =======================================================
def start_scheduler():
    """
        Function for calling the APScheduler
    """
    scheduler.start()
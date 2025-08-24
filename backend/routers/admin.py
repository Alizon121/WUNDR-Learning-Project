# routers/admin.py
from fastapi import APIRouter, Depends, BackgroundTasks, status, HTTPException
from pydantic import BaseModel
from typing import Annotated, List
from backend.db.prisma_client import db
from backend.models.user_models import User
from backend.routers.notifications import send_email_multiple_users
from backend.routers.auth.login import get_current_user
from backend.routers.auth.utils import enforce_admin
from email_validator import validate_email, EmailNotValidError

# --- helpers -------------------------------------------------
def is_valid_email(addr: str) -> bool:
    """Check syntax of email (without deliverability)."""
    if not addr:
        return False
    try:
        validate_email(addr, check_deliverability=False)
        return True
    except EmailNotValidError:
        return False

router = APIRouter(prefix="/admin", tags=["admin"])

class NotifyRequest(BaseModel):
    subject: str
    message: str


# --- Notify ALL users ----------------------------------------
@router.post("/notify", status_code=status.HTTP_200_OK)
async def notify_all_users(
    payload: NotifyRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):
    """
    Admin-only: send a message to ALL users.
    - creates entries in Notifications (description + userId)
    - sends emails (validated) in the background
    """
    enforce_admin(current_user, "send notifications")

    users = await db.users.find_many()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")

    # collect + validate emails
    raw_emails: List[str] = [getattr(u, "email", "") for u in users]
    clean_emails: List[str] = []
    for e in raw_emails:
        if isinstance(e, str):
            e_norm = e.strip().lower()
            if is_valid_email(e_norm):
                clean_emails.append(e_norm)

    # remove duplicates
    emails: List[str] = list(dict.fromkeys(clean_emails))
    skipped = len(raw_emails) - len(emails)

    # create notifications in DB
    for u in users:
        await db.notifications.create(
            data={"description": payload.message, "userId": u.id}
        )

    # send emails in background
    if emails:
        background_tasks.add_task(
            send_email_multiple_users,
            emails,
            payload.subject,
            payload.message,
        )

    return {
        "message": f"Notification queued for {len(users)} users",
        "emailsPlanned": len(emails),
        "invalidEmailsSkipped": skipped,
    }


# --- Notify EVENT users --------------------------------------
@router.post("/events/{event_id}/notify", status_code=status.HTTP_200_OK)
async def notify_event_users(
    event_id: str,
    payload: NotifyRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):
    """
    Admin-only: send a message to all participants of a specific event.
    """
    enforce_admin(current_user, "notify event users")

    event = await db.events.find_unique(
        where={"id": event_id},
        include={"users": True},
    )
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    users = event.users or []
    if not users:
        raise HTTPException(status_code=404, detail="No users for this event")

    # collect + validate emails
    raw_emails: List[str] = [getattr(u, "email", "") for u in users]
    clean_emails: List[str] = []
    for e in raw_emails:
        if isinstance(e, str):
            e_norm = e.strip().lower()
            if is_valid_email(e_norm):
                clean_emails.append(e_norm)

    emails: List[str] = list(dict.fromkeys(clean_emails))
    skipped = len(raw_emails) - len(emails)

    # save notifications in DB
    for u in users:
        await db.notifications.create(
            data={
                "description": f"[{event.name}] {payload.message}",
                "userId": u.id,
            }
        )

    # send emails in background
    if emails:
        background_tasks.add_task(
            send_email_multiple_users,
            emails,
            payload.subject,
            payload.message,
        )

    return {
        "message": f"Notification queued for {len(users)} users of event '{event.name}'",
        "emailsPlanned": len(emails),
        "invalidEmailsSkipped": skipped,
    }

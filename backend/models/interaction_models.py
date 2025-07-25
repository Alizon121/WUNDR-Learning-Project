from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, TYPE_CHECKING, Optional
from datetime import datetime


if TYPE_CHECKING:
    from models.user_models import User, Child


# ! Notifications
class Notification(BaseModel):
    id: str = Field(..., min_length=1, description="Notification identifier")
    description: str = Field(
        min_length = 1,
        max_length = 500,
    )
    user: "User"


# ! Activities
class Activity(BaseModel):
    id: str = Field(min_length=1, description="Activity identifier")
    name: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=750)
    events: List["Event"] = Field(default_factory=list)

class ActivityCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)

class ActivityUpdate(BaseModel):
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)


# ! Events
class Event(BaseModel):
   id: str = Field(..., min_length=1, description="Event identifier")
   activity: "Activity"

   name: str = Field(min_length=1)
   description: str = Field(min_length=1)

   users: List["User"] = Field(default_factory=list)
   children: List["Child"] = Field(default_factory=list)
   reviews: List["Review"] = Field(default_factory=list)

   createdAt: datetime = Field(default_factory=datetime.utcnow)
   updatedAt: datetime = Field(default_factory=datetime.utcnow)

class EventCreate(BaseModel):
    activityId: str = Field(min_length=1)

    name: str = Field(min_length=1)
    description: str = Field(min_length=1)

    userIds: List[str] = Field(default_factory=list)
    childIds: List[str] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class EventUpdate(BaseModel):
    activityId: Optional[str] = Field(min_length=1)

    name: str = Field(min_length=1)
    description: str = Field(min_length=1)

    userIds: Optional[List[str]] = Field(default=None)
    childIds: Optional[List[str]] = Field(default=None)

# ! Reviews
class Review(BaseModel):
    id: str = Field(..., min_length=1, description="Review identifier")
    rating: int = Field(
        ge = 1,
        le = 5
    )
    description: str = Field(min_length=20, max_length=400)
    event: "Event"
    parent: "User"

class ReviewCreate(BaseModel):
    eventId: str = Field(min_length=1)
    parentId: str = Field(min_length=1)
    rating: int = Field(
        ge=1,
        le=5
    )
    description: str = Field(min_length=20, max_length=400)

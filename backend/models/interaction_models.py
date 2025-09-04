from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, TYPE_CHECKING, Optional
from datetime import datetime, timezone


if TYPE_CHECKING:
    from models.user_models import User, Child


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
    date: datetime = Field(default_factory=datetime.now(timezone.utc))
    image: str = Field(min_length=1)
    participants: int = Field(default=0)
    limit: int = Field(default=10)
    
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    address: str = Field(min_length=1)
    zipCode: int = Field(length=5)
    latitude: float
    longitude: float
    
    # users: List["User"] = Field(default_factory=list)
    # children: List["Child"] = Field(default_factory=list)
    # reviews: List["Review"] = Field(default_factory=list)

    # createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
    # updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class EventCreate(BaseModel):
    activityId: str = Field(min_length=1)

    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    date: datetime = Field(default_factory=datetime.now(timezone.utc))
    image: str = Field(min_length=1)
    participants: int = Field(default=0)
    limit: int = Field(default=10)
    
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    address: str = Field(min_length=1)
    zipCode: int = Field(length=5)
    latitude: float
    longitude: float

    userIDs: List[str] = Field(default_factory=list)
    childIDs: List[str] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class EventUpdate(BaseModel):
    activityId: Optional[str] = Field(default=None)

    name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    date: Optional[datetime] = Field(default=None)
    
    city: Optional[str] = Field(default=None)
    state: Optional[str] = Field(default=None)
    address: Optional[str] = Field(default=None)
    zipCode: Optional[int] = Field(default=None)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)

    image: Optional[str] = Field(default=None)
    participants: Optional[int] = Field(default=None)
    limit: Optional[int] = Field(default=None)
    userIDs: Optional[List[str]] = Field(default=None)
    childIDs: Optional[List[str]] = Field(default=None)

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
    createdAt: datetime
    updatedAt: datetime

class ReviewCreate(BaseModel):
    eventId: str = Field(min_length=1)
    parentId: str = Field(min_length=1)
    rating: int = Field(
        ge=1,
        le=5
    )
    description: str = Field(min_length=20, max_length=400)
    createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class ReviewUpdate(BaseModel):
    rating: int = Field(
        ge=1,
        le=5
    )
    description: str = Field(min_length=20, max_length=400)

# ! Notifications
class Notification(BaseModel):
    id: str = Field(..., min_length=1, description="Notification identifier")
    description: str = Field(
        min_length = 1,
        max_length = 500,
    )
    title: str = Field(
        min_length = 2,
        max_length=80,
    )
    isRead: bool = Field(default=False)
    userId: str = Field(..., description="User id associated with the notification")

    class Config:
        form_attributes = True

#! Jobs
class Jobs(BaseModel):
    id: str
    runAt: datetime
    reminderType: str
    status: str
    jobType: str
    sentAt: Optional[datetime] = None
    errorMessage: Optional[str] = None
    eventId: str

    class Config:
        form_attributes = True
    
from pydantic import BaseModel, Field, HttpUrl, field_validator
# from models.interaction_models import Review, Notification, Activity, Event
from typing import List, Optional, TYPE_CHECKING
from enum import Enum
from datetime import datetime

if TYPE_CHECKING:
   from models.interaction_models import Notification, Activity, Event, Review

class Role(str, Enum):
  PARENT = "parent"
  ADMIN = "admin"
  INSTRUCTOR = "instructor"

class User(BaseModel):
    id: str = Field(..., min_length=1, description="User identifier")

    firstName: str = Field(min_length=1, max_length=50)
    lastName: str = Field(min_length=1, max_length=50)
    email: str = Field(pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    role: Role
    avatar: HttpUrl
    password: str

    city: str = Field(min_length=2, max_length=50)
    state: str = Field(min_length=2, max_length=50)
    zipCode: int

    children: List["Child"] = Field(default_factory=list)  # Default to empty list
    enrolledEvents: List["Event"] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    notifications: List["Notification"] = Field(default_factory=list)
    reviews: List["Review"] = Field(default_factory=list)

    @field_validator("avatar")
    def validate_avatar_extension(cls, v):
        if not v.path.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
            raise ValueError("Avatar URL must end in a valid image extension")
        return v

class Child(BaseModel):
  id: str = Field(..., min_length=1, description="Child identifier")
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = Field(default_factory=False)
  age: int = Field(ge=10)

  parents: List["User"] = Field(default_factory=list)
  enrolledEvents: List["Event"] = Field(default_factory=list)

  created_at: datetime = Field(default_factory=datetime.utcnow)
  updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChildCreate(BaseModel):
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = False
  age: int = Field(ge=10)
  createdAt: datetime = Field(default_factory=datetime.utcnow)
  updatedAt: datetime = Field(default_factory=datetime.utcnow)


class ChildUpdate(BaseModel):
  firstName: Optional[str] = Field(min_length=1, max_length=50)
  homeschool: Optional[bool]

from pydantic import BaseModel, Field, HttpUrl, EmailStr, field_validator, model_validator
# from models.interaction_models import Review, Notification, Activity, Event
from typing import List, Optional, TYPE_CHECKING
from enum import Enum
from datetime import datetime, timedelta, timezone

if TYPE_CHECKING:
   from models.interaction_models import Notification, Event, Review

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
    avatar: str
    password: str

    city: str = Field(min_length=2, max_length=50)
    state: str = Field(min_length=2, max_length=50)
    zipCode: int

    children: List["Child"] = Field(default_factory=list)  # Default to empty list
    enrolledEvents: List["Event"] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))
    notifications: Optional[List["Notification"]] = Field(default_factory=list)
    reviews: Optional[List["Review"]] = Field(default_factory=list)

    @field_validator("avatar")
    def validate_avatar_extension(cls, v):
      if not isinstance(v, str):
          raise TypeError("Avatar must be a string URL")
      if not v.lower().endswith((".com", ".png", ".jpg", ".jpeg", ".webp", ".gif")):
          raise ValueError("Avatar URL must end in a valid image extension")
      return v

class PasswordResetRequest(BaseModel):
   email: EmailStr

class PasswordResetPayload(BaseModel):
   token: str = Field(description="Password reset token")
   new_password: str = Field(min_length=8, description="New Account Password")

class Child(BaseModel):
  id: str = Field(..., min_length=1, description="Child identifier")
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = Field(default_factory=False)
  birthday: datetime = Field(description="Child's date of birth", default_factory=datetime.now(timezone.utc))

  parents: Optional[List["User"]] = Field(default_factory=list)
  enrolledEvents: List["Event"] = Field(default_factory=list)

  createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
  updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class ChildCreate(BaseModel):
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = False
  birthday: datetime = Field(description="Child's date of birth", default_factory=datetime.now(timezone.utc))
  createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
  updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class ChildUpdate(BaseModel):
  firstName: Optional[str] = Field(min_length=1, max_length=50)
  homeschool: Optional[bool]

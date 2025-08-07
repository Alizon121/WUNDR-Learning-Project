from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict, model_validator
# from models.interaction_models import Review, Notification, Activity, Event
from typing import List, Optional, TYPE_CHECKING
from enum import Enum
from datetime import datetime, timedelta, timezone, date

if TYPE_CHECKING:
   from models.interaction_models import Notification, Event, Review


# * User models
class Role(str, Enum):
  PARENT = "parent"
  ADMIN = "admin"
  INSTRUCTOR = "instructor"
  VOLUNTEER = "volunteer" 

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

class UserUpdateRequest(BaseModel):
    """Request model for updating user data - all fields optional"""
    firstName: Optional[str] = Field(None, min_length=1, max_length=50)
    lastName: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[str] = Field(None, pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    # role: Optional[Role] = None
    avatar: Optional[str] = Field(None, description="Avatar URL as string")
    password: Optional[str] = None

    city: Optional[str] = Field(None, min_length=2, max_length=50)
    state: Optional[str] = Field(None, min_length=2, max_length=50)
    zipCode: Optional[int] = None


class UserResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    role: Role
    avatar: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[int] = None
    children: List["Child"] = Field(default_factory=list)
    enrolledEvents: List["Event"] = Field(default_factory=list)
    reviews:List["Review"] = Field(default_factory=list)
    notifications: List["Notification"] = Field(default_factory=list)
    createdAt: datetime
    updatedAt: datetime

    @field_validator("children", "enrolledEvents", "notifications", "reviews", mode="before")
    @classmethod
    def _none_to_list(cls, v):
        # if DB/ORM gave us None, make it an empty list
        return [] if v is None else v

    model_config = ConfigDict(from_attributes=True)

class UserUpdateResponse(BaseModel):
    """Response model for successful user update"""
    message: str
    user: UserResponse

# * Password Reset models

class PasswordResetRequest(BaseModel):
   email: EmailStr

class PasswordResetPayload(BaseModel):
   token: str = Field(description="Password reset token")
   new_password: str = Field(min_length=8, description="New Account Password")


# * Child models
class Child(BaseModel):
  id: str = Field(..., min_length=1, description="Child identifier")
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = Field(default_factory=False)
  birthday: date = Field(description="Child's date of birth", default_factory=date.today)

  parents: Optional[List["User"]] = Field(default_factory=list)
  enrolledEvents: List["Event"] = Field(default_factory=list)

  createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
  updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class ChildCreate(BaseModel):
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = False
  # birthday: date = Field(description="Child's date of birth", default_factory=date.today)
  birthday: datetime = Field(
      description="Child's date of birth",
      default_factory=lambda: datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
      )
    )
  createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
  updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class ChildUpdate(BaseModel):
  firstName: Optional[str] = Field(min_length=1, max_length=50)
  homeschool: Optional[bool]

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
    phoneNumber: str = Field(pattern=r'^\+[1-9]\d{1,14}$', description="Phone number in E.164 format (+12025550123)")
    role: Role
    avatar: Optional[str] = None
    password: str

    address: str = Field(min_length=3, max_length=200)
    city: str = Field(min_length=2, max_length=50)
    state: str = Field(min_length=2, max_length=50)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')

    children: List["Child"] = Field(default_factory=list)  # Default to empty list
    events: List["Event"] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))
    notifications: Optional[List["Notification"]] = Field(default_factory=list)
    reviews: Optional[List["Review"]] = Field(default_factory=list)

    @field_validator("avatar")
    def validate_avatar_extension(cls, v):
      if v is None:
         return v
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
    phoneNumber: Optional[str] = Field(pattern=r'^\+[1-9]\d{1,14}$', description="Phone number in E.164 format (+12025550123)")
    # role: Optional[Role] = None
    avatar: Optional[str] = Field(None, description="Avatar URL as string")
    password: Optional[str] = None

    address: Optional[str] = Field(min_length=3, max_length=200)
    city: Optional[str] = Field(None, min_length=2, max_length=50)
    state: Optional[str] = Field(None, min_length=2, max_length=50)
    zipCode: Optional[str] = Field(pattern=r'^\d{5}(-\d{4})?$')


class UserResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    phoneNumber: str
    role: Role
    avatar: Optional[str] = None
    address: str = Field(min_length=3, max_length=200)
    city: str = Field(None, min_length=2, max_length=50)
    state: str = Field(None, min_length=2, max_length=50)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')
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
  preferredName: Optional[str] = Field(default=None, max_length=50)
  birthday: datetime = Field(default_factory=..., description="Child's birthday")

  homeschool: bool = Field(default_factory=False)
  grade: Optional[int] = Field(default=None, ge=-1, le=12)

  parents: Optional[List["User"]] = Field(default_factory=list)
  enrolledEvents: List["Event"] = Field(default_factory=list)

  allergiesMedical: Optional[str] = Field(default=None, max_length=1000)
  notes: Optional[str] = Field(default=None, max_length=1000)

  photoConsent: bool = False
  waiver: bool = False

  createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
  updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))


class ChildCreate(BaseModel):
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  preferredName: Optional[str] = Field(default=None, max_length=50)
  birthday: datetime = Field(
      description="Child's date of birth",
      default_factory=lambda: datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
      )
    )

  homeschool: bool = Field(default_factory=False)
  grade: Optional[int] = Field(default=None, ge=-1, le=12)

  allergiesMedical: Optional[str] = Field(default=None, max_length=1000)
  notes: Optional[str] = Field(default=None, max_length=1000)

  photoConsent: bool = False
  waiver: bool = False

  emergencyContacts: List["EmergencyContactCreate"] = Field(default_factory=list)

  createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))
  updatedAt: datetime = Field(default_factory=datetime.now(timezone.utc))


class ChildUpdate(BaseModel):
  firstName: Optional[str] = Field(default=None)
  lastName: Optional[str] = Field(default=None)
  preferredName: Optional[str] = Field(default=None, max_length=50)
  birthday: Optional[datetime] = Field(
    default=None,
    description="Child's date of birth"
  )

  homeschool: Optional[bool] = Field(default=None)
  grade: Optional[int] = Field(default=None, ge=-1, le=12)

  allergiesMedical: Optional[str] = Field(default=None, max_length=1000)
  notes: Optional[str] = Field(default=None, max_length=1000)

  photoConsent: bool = False
  waiver: bool = False



#! Emergency Contact
class EmergencyContactCreate(BaseModel):
    firstName: str = Field(min_length=1, max_length=100)
    lastName: str = Field(min_length=1, max_length=100)
    relationship: str = Field(min_length=1, max_length=200)
    phoneNumber: str = Field(pattern=r'^\+[1-9]\d{1,14}$')
    # priority: int = Field(ge=1, le=3)

class EmergencyContactUpdate(BaseModel):
    firstName: str = Field(default=None)
    lastName: str = Field(default=None)
    relationship: str = Field(default=None)
    phoneNumber: str = Field(pattern=r'^\+[1-9]\d{1,14}$')
    # priority: int = Field(default=None)

class EmergencyContactResponse(EmergencyContactCreate):
    id: str
    childId: str
    createdAt: datetime
    updatedAt: datetime

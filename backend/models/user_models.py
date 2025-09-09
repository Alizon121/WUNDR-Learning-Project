from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
# from models.interaction_models import Review, Notification, Activity, Event
from typing import List, Optional, TYPE_CHECKING
from enum import Enum
from datetime import datetime, timedelta, timezone, date

if TYPE_CHECKING:
    from models.interaction_models import Notification, Event, Review


# * User models =================================================
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

# * Volunteer models ==========================================
class AvailabilityDays(str, Enum):
    WEEKDAYS = "Weekdays"
    WEEKENDS = "Weekends"

class AvailabilityTimes(str, Enum):
    MORNING = "Morning"
    AFTERNOON = "Afternoon"
    EVENING = "Evening"

class Availability(BaseModel):
    days: Optional[List[AvailabilityDays]] = None
    times: Optional[List[AvailabilityTimes]] = None
    
    @field_validator('days', 'times', mode="before")
    def validate_availability(cls, v):
        if v is None or v == []:
            return None
        return v

class Volunteer(BaseModel):
  id: str = Field(..., min_length=1, description="Volunteer identifier")
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  email: Optional[str] = Field(pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
  phoneNumber: Optional[str]
  cities: List[str] = Field(default_factory=list)
  availability: Optional[Availability]
  skills: List[str] = Field(default_factory=list)
  bio: Optional[str] = Field(min_length=5, max_length=500)
  photoConsent: bool = Field(default=False)
  backgroundCheckConsent: bool = Field(default=False)

  createdAt: datetime
  updatedAt: Optional[datetime]

  model_config = {
    "from_attributes":True,
    "json_encoders":{
      datetime: lambda v: v.isoformat()
    }
  }
  

class VolunteerCreate(BaseModel):
  firstName: str = Field(..., min_length=1, max_length=100, description="First Name")
  lastName: str = Field(..., min_length=1, max_length=100, description="Last Name")
  email: Optional[EmailStr] = Field(None, description="Email")
  phoneNumber: Optional[str] = Field(None, min_length = 10, max_length= 20, description="Phone number")
  cities: Optional[List[str]] = Field(default_factory=list, description="Cities to volunteer in")
  availability: Optional[Availability] = Field(None, description="Availability schedule")
  skills: Optional[List[str]] = Field(default_factory=list, description="Volunteer skills")
  bio: Optional[str] = Field(None, min_length=5, max_length=500, description="Volunteer bio")
  photoConsent: bool = Field(..., description="Must consent to photo usage")
  backgroundCheckConsent: bool = Field(..., description="Must consent to background check")
  # userId: str = Field(..., description="Associated user ID")

  @field_validator("cities", "skills", mode="before")
  def clean_lists(cls, v):
    if v is None:
       return []
    return [item.strip() for item in v if item and item.strip()]
  
class VolunteerUpdate(BaseModel):
  firstName: Optional[str] = None
  lastName: Optional[str] = None
  email: Optional[str] = None
  phoneNumber: Optional[str] = None
  cities: Optional[List[str]] = None
  availability: Optional[Availability] = None
  skills: Optional[List[str]] = None
  bio: Optional[str] = Field(None, min_length=5, max_length=500)
  photoConsent: Optional[bool] = None
  backgroundCheckConsent: Optional[bool] = None

  @field_validator("cities", "skills", mode="before")
  def clean_lists(cls, v):
     if v is None:
      return None
     return [item.strip() for item in v if item and item.strip()]

# * Password Reset models ============================================

class PasswordResetRequest(BaseModel):
   email: EmailStr

class PasswordResetPayload(BaseModel):
   token: str = Field(description="Password reset token")
   new_password: str = Field(min_length=8, description="New Account Password")


# * Child models ====================================================
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

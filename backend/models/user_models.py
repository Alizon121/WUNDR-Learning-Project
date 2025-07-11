from pydantic import BaseModel, Field, HttpUrl, field_validator
from models.interaction_models import Review, Notification, Activity
from typing import List, Optional
from enum import Enum
from datetime import datetime

class Role(str, Enum):
  PARENT = "PARENT"
  MODERATOR = "MODERATOR"

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
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    notifications: List[Notification] = Field(default_factory=list)
    reviews: List[Review] = Field(default_factory=list)

    @field_validator("avatar")
    def validate_avatar_extension(cls, v):
        if not v.path.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
            raise ValueError("Avatar URL must end in a valid image extension")
        return v


class Child(BaseModel):
  id: str = Field(..., min_length=1, description="User identifier")
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = Field(default_factory=False)
  age: int = Field(ge=10)
  enrolledActivities: List[Activity] = Field(default_factory=list)

class ChildCreate(BaseModel):
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = False
  age: int = Field(ge=10)

class ChildUpdate(BaseModel):
  firstName: Optional[str] = Field(min_length=1, max_length=50)
  homeschool: Optional[bool]

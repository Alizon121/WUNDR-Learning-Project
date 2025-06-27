from pydantic import BaseModel, Field
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.user_models import User, Child

class Notification(BaseModel):
    id: str = Field(..., min_length=1, description="Notification identifier")
    description: str = Field(
        min_length = 1,
        max_length = 500,
    )
    user: "User"

class Activity(BaseModel):
    id: str = Field(min_length=1, description="User identifier")
    name: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=750)
    events: List["Event"] = Field(default_factory=list)
    reviews: List["Review"] = Field(default_factory=list)
    children: List["Child"] = Field(default_factory=list)

class Event(BaseModel):
   id: str = Field(..., min_length=1, description="User identifier")
   activity: Activity
   reviews: List["Review"] = Field(default_factory=list)

class Review(BaseModel):
    id: str = Field(..., min_length=1, description="Review identifier")
    rating: int = Field(
        ge = 1,
        le = 5
    )
    event: Event
    actvity: Activity
    parent: "User"

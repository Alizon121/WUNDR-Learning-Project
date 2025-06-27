from pydantic import BaseModel, Field
from event import Event
from activity import Activity
from user import User

class Review(BaseModel):
    id: str = Field(..., min_length=1, description="Review identifier")
    rating: int = Field(
        ge = 1,
        le = 5
    )
    event: Event
    actvity: Activity
    parent: User

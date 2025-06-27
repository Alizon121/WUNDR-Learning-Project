from pydantic import BaseModel, Field
from models.event import Event
from models.activity import Activity
from models.user import User

class Review(BaseModel):
    id: str = Field(..., min_length=1, description="Review identifier")
    rating: int = Field(
        ge = 1,
        le = 5
    )
    event: Event
    actvity: Activity
    parent: User

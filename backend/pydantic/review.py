from pydantic import BaseModel
from event import Event
from activity import Activity
from user import User

class Review(BaseModel):
    id: str
    rating: int
    event: Event
    actvity: Activity
    parent: User
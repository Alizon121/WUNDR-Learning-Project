from pydantic import BaseModel
from event import Event
from review import Review
from child import Child

class Activity(BaseModel):
    id: str
    name: str
    description: str
    events: Event
    reviews: Review
    children: Child
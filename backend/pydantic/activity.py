from pydantic import BaseModel
from event import Event
from review import Review
from child import Child
from typing import List

class Activity(BaseModel):
    id: str
    name: str
    description: str
    events: List[Event]
    reviews: List[Review]
    children: List[Child]

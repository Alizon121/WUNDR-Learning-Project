from pydantic import BaseModel, Field
from event import Event
from review import Review
from child import Child
from typing import List

class Activity(BaseModel):
    id: str = Field(min_length=1, description="User identifier")
    name: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=750)
    events: List[Event] = Field(default_factory=list)
    reviews: List[Review] = Field(default_factory=list)
    children: List[Child] = Field(default_factory=list)

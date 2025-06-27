from pydantic import BaseModel, Field
from activity import Activity
from review import Review
from typing import List

class Event(BaseModel):
   id: str = Field(..., min_length=1, description="User identifier")
   activity: Activity
   reviews: List[Review] = Field(default_factory=list)

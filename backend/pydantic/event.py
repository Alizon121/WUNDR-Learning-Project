from pydantic import BaseModel
from activity import Activity
from review import Review
from typing import List

class Event(BaseModel):
   id: str
   activity: Activity
   reviews: List[Review]

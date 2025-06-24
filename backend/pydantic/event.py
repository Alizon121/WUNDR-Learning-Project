from pydantic import BaseModel
from activity import Activity
from review import Review


class Event(BaseModel):
   id: str
   activity: Activity
   reviews: Review #needs to be a list
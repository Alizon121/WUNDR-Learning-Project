from pydantic import BaseModel
from activity import Activity
from typing import List

class Child(BaseModel):
  id: str
  firstName: str
  lastName: str
  homeschool: bool
  age: int
  enrolledActivities: List[Activity]

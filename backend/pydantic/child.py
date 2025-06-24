from pydantic import BaseModel
from activity import Activity

class Child(BaseModel):
  id: str
  firstName: str
  lastName: str
  homeschool: bool
  age: int
  enrolledActivities: Activity

from pydantic import BaseModel, Field
from models.activity import Activity
from typing import List

class Child(BaseModel):
  id: str = Field(..., min_length=1, description="User identifier")
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = Field(default_factory=False)
  age: int = Field(ge=10)
  enrolledActivities: List[Activity] = Field(default_factory=list)

class ChildCreate(BaseModel):
  firstName: str = Field(min_length=1, max_length=50)
  lastName: str = Field(min_length=1, max_length=50)
  homeschool: bool = False
  age: int = Field(ge=10)

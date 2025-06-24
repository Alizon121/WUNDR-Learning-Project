from enum import Enum
from pydantic import BaseModel
from child import Child
from pydantic_extra_types.pendulum_dt import DateTime
from notification import Notification
from review import Review
from typing import List

class Role(str, Enum):
  PARENT = "PARENT"
  MODERATOR = "MODERATOR"

class Profile(BaseModel):
  firstName: str
  lastName: str
  email: str
  role: Role
  avatar: str

class Address(BaseModel):
  city: str
  stateRegion: str
  zipCode: int

class User(BaseModel):
    id: str
    profile: Profile
    address: Address
    children: List[Child]
    createdAt: DateTime
    updatedAt: DateTime
    notifications: List[Notification]
    reviews: List[Review]

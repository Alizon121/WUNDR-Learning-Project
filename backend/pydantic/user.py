from pydantic import BaseModel, Field
from child import Child
from notification import Notification
from review import Review
from address import Address
from profile import Profile
from typing import List
from datetime import datetime

class User(BaseModel):
    id: str = Field(..., min_length=1, description="User identifier")
    profile: Profile
    address: Address
    children: List[Child] = Field(default_factory=list)  # Default to empty list
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    notifications: List[Notification] = Field(default_factory=list)
    reviews: List[Review] = Field(default_factory=list)

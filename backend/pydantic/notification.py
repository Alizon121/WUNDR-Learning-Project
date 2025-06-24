from enum import Enum
from pydantic import BaseModel
from user import User

class Notification(BaseModel):
    id: str
    description: str
    user: User
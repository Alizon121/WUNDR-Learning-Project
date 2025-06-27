from pydantic import BaseModel, Field, HttpUrl, field_validator
from enum import Enum

class Role(str, Enum):
  PARENT = "PARENT"
  MODERATOR = "MODERATOR"

class Profile(BaseModel):
    id: str = Field(..., min_length=1, description="Profile identifier")
    firstName: str = Field(min_length=1, max_length=50)
    lastName: str = Field(min_length=1, max_length=50)
    email: str = Field(regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    role: Role
    avatar: HttpUrl

    @field_validator("avatar")
    def validate_avatar_extension(cls, v):
        if not v.path.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
            raise ValueError("Avatar URL must end in a valid image extension")
        return v

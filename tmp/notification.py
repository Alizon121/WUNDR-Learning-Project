from pydantic import BaseModel, Field

class Notification(BaseModel):
    id: str = Field(..., min_length=1, description="Notification identifier")
    description: str = Field(
        min_length = 1,
        max_length = 500,
    )
    user: User

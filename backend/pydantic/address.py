from pydantic import BaseModel, Field

class Address(BaseModel):
    id: str = Field(min_length=1, description="User identifier")
    city: str = Field(min_length=2, max_length=50)
    state: str = Field(min_length=2, max_length=50)
    zipCode: int

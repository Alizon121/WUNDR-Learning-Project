from fastapi import APIRouter, status, HTTPException, Depends
from pydantic import BaseModel, Field, HttpUrl
from db.prisma_client import db
from typing import Annotated, Optional
from models.user_models import User, Role
from datetime import datetime
from .auth.login import get_current_active_user
from .auth.utils import hash_password

router = APIRouter()


# Make a route for updating user's children

class UserUpdateRequest(BaseModel):
    """Request model for updating user data - all fields optional"""
    firstName: Optional[str] = Field(None, min_length=1, max_length=50)
    lastName: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[str] = Field(None, pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    # role: Optional[Role] = None
    avatar: Optional[HttpUrl] = None
    password: Optional[str] = None
    
    city: Optional[str] = Field(None, min_length=2, max_length=50)
    state: Optional[str] = Field(None, min_length=2, max_length=50)
    zipCode: Optional[int] = None

class UserUpdateResponse(BaseModel):
    """Response model for successful user update"""
    message: str
    user: User

@router.put("/", response_model=UserUpdateResponse)
async def update_user(
    update_data: UserUpdateRequest,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """
    Update the current user's profile information.
    
    - **firstName**: Update first name (1-50 characters)
    - **lastName**: Update last name (1-50 characters)
    - **email**: Update email address (must be valid email format)
    - **role**: Update user role
    - **avatar**: Update avatar URL
    - **password**: Update password (will be hashed)
    - **city**: Update city (2-50 characters)
    - **state**: Update state (2-50 characters)
    - **zipCode**: Update zip code
    """
    
    try:
        # Create a dictionary of fields to update (exclude None values)
        update_fields = {
            field: value 
            for field, value in update_data.dict(exclude_unset=True).items() 
            if value is not None
        }
        
        # If no fields to update, return early
        if not update_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided for update"
            )
        
        # Special handling for password - should be hashed
        if 'password' in update_fields:
            update_fields['password'] = hash_password(update_fields['password'])
        
        # Add updated timestamp to database update
        update_fields['updated_at'] = datetime.utcnow()
        
        # Check if email is being updated and if it's already taken
        if 'email' in update_fields and update_fields['email'] != current_user.email:
            existing_user = await db.user.find_unique(
                where={"email": update_fields['email']}
            )
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email address is already registered"
                )
        
        # Update user in database using Prisma syntax
        updated_user = await db.user.update(
            where={"id": current_user.id},
            data=update_fields
        )
        
        # Convert the updated user to your User model if needed
        # This depends on how your Prisma models map to Pydantic models
        if updated_user:
            return UserUpdateResponse(
                message="User profile updated successfully",
                user=User(**updated_user.dict()) if hasattr(updated_user, 'dict') else updated_user
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating user: {str(e)}"
        )
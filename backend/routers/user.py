from fastapi import APIRouter, status, HTTPException, Depends
from pydantic import BaseModel, Field, HttpUrl
from db.prisma_client import db
from typing import Annotated, Optional, List
from models.user_models import User, Child, Role
from datetime import datetime
from .auth.login import get_current_active_user
from .auth.utils import hash_password

router = APIRouter()

class UserResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    role: Role
    avatar: Optional[HttpUrl] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[int] = None
    children: List["Child"] = []

    class Config:
        from_attributes = True

UserResponse.model_rebuild()

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

User.model_rebuild()

# Rebuild models to ensure all references are resolved
UserUpdateResponse.model_rebuild()

@router.get("/", response_model=List[UserResponse])
async def get_all_users():
    # MAY NEED TO ADD PAGINATION
    """
    Get all users from the database.

    Returns:
        List[UserResponse]: List of all users
    """
    try:
        all_users = await db.users.find_many(
            include={
                "children": True
            }
        )
        return all_users
    except HTTPException as e:
        print(f"Error fetching users: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to obtain user profiles"
        )

# get select user
@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """
    Get the current authenticated user's information.

    Returns:
        UserResponse: Current user's profile information
    """
    try:
        user = await db.users.find_unique(
            where={
                "id": current_user.id
            },
            include={
                "children": True  # Fixed: removed = in dictionary syntax
            }
        )

        # Handle case where user is not found (shouldn't happen with valid auth)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return user

    except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
    except Exception as e:
            print(f'Error fetching user: {e}')
            raise HTTPException(
                status_code=500,
                detail="Failed to obtain user profile"
            )


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
        updated_user = await db.users.update(
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
#  Delete a user endpoint
@router.delete("/")
async def delete_user(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    try:
        deleted_user = await db.users.delete(
                where={"id": current_user.id}
            )
        if deleted_user:
            return "User profile deleted successfully"

        else:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
    except HTTPException:
        raise
    except HTTPException as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to delete user profile"
        )

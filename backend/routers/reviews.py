from fastapi import Depends, status, HTTPException, APIRouter, logger
from db.prisma_client import db
from typing import Annotated
from models.interaction_models import ReviewCreate, ReviewUpdate
from models.user_models import User
from .auth.login import get_current_user, get_current_active_user_by_email
from auth.utils import enforce_admin
from datetime import datetime

router = APIRouter()

@router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_reviews(
        current_user: Annotated[User, Depends(get_current_user)],
        rating: int | None = None,
        event_id: str | None = None,
        parent_id: str | None = None,
    ):
        """
        Get All Reviews

        If admin, get all reviews by an rating, event, or user (e.g. parent)
        If no filters are provided, endpoint fetches ALL reviews
        verify admin status
        return "reviews": {reviews}
        """

        if not current_user:
                raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=f'You must be authorized to view all reviews'
                )
        
        enforce_admin(current_user, "get all reviews or filtered reviews")

        # ! Add pagination??
        try:
            filters = {}
            if rating is not None:
                filters["rating"] = rating
            if event_id is not None:
                filters["event_id"] = event_id
            if parent_id is not None:
                filters["parent_id"] = parent_id

            reviews = await db.reviews.find_many(
                where=filters,
                include={
                        "event": True,
                        "parent": True
                }
            )

            return {"reviews": reviews}
        except HTTPException as e:
            print(f'Errors fetching reviews due to {e}')
            raise HTTPException(
                status_code=500,
                detail="Failed to obtain review"
            )
        
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_review(
     review_data: ReviewCreate,
     current_user: Annotated[User, Depends(get_current_user)]
):
     """
        Create Review

        Get the current user for authentication and create review
     """
     event = await db.events.find_unique(
            where={"id": review_data.eventId}
        )
        
     if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
     

    # ! Do we need to add logic for preventing one user making many reviews?
     try:
          review = await db.reviews.create(
               data={
                    "eventID": review_data.eventId,
                    "parentId": current_user.id,
                    "rating": review_data.rating,
                    "description": review_data.description
               }
          )
     except Exception as e:
          raise HTTPException(
               status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
               detail=f'Failed to create review: {e}'
          )
     
     return {
          "review": review, 
          "message": "Review successfully made"
          }

@router.patch("/{review_id}", status_code=status.HTTP_200_OK)
async def update_review(
    review_id: str,
    review_data: ReviewUpdate,
    current_user = Depends(get_current_active_user_by_email)
):
     """ 
     Update the current user's review
     
     - **rating: Update rating (1-5 stars)
     - ** description: Update description (20-400 length)
     """

    # Authenticate user
     if not current_user:
          raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail=(f"Unauthorized. You must be authenticated to update a review")
          )
     
    # Find the review
     review = await db.reviews.find_unique(
         where={"id": review_id}
     )

    # Validate the event
     event = await db.reviews.find_unique(
        where={"eventID": review_data.eventId}    
     )
     if not event:
          raise HTTPException(
               status_code=status.HTTP_404_NOT_FOUND,
               detail=(f'Event not found')
          )
     
    
    # Update payload:
     payload = {}

     if review_data.rating is not None:
          payload["rating"] = review_data.rating
     if review_data.description is not None:
          payload["description"] = review_data.description

     payload["updatedAt"] = datetime.utcnow()


     updated_review = await db.reviews.update(
          where={"id": review_id},
          data=payload
     )

     return {
          "event": updated_review,
          "message": "Review updated successfully"
     }

@router.delete("/{review_id}", status_code=status.HTTP_200_OK)
async def delete_review(
     review_id: str,
     current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Delete a review

    An authenticated user is allowed to delete their review
    """
    try:
        # Authenticate user
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=(f'Unauthorized. You must be authenticared to delete a review')
            )
        
        # Query review
        review = await db.reviews.find_unique(
            where={"id": review_id}
        )

        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found"
            )
        
        deleted_review = await db.reviews.delete(
            where={"id": review_id}
        )

        if deleted_review:
            return "Review deleted successfully"
    
    except HTTPException:
         raise
    except HTTPException as e:
              raise HTTPException(
              status_code=500,
              detail="Failed to delete the review"
              )
from fastapi import FastAPI, Depends, status, HTTPException, APIRouter
from db.prisma_client import db
from typing import Annotated
from ..models.interaction_models import Review
from ..models.user_models import User
from .auth.login import get_current_user
from .auth.utils import enforce_admin


router = APIRouter()

@router.get("/reviews", status_code=status.HTTP_200_OK)
async def get_all_reviews(
        current_user: Annotated[User, Depends(get_current_user)],
        rating: int | None = None,
        event_id: str | None = None,
        parent_id: str | None = None,
    ):
        """
        Get All Reviews

        If admin, get all reviews for an event
        verify admin status
        return "reviews": {reviews}
        """

        if not current_user:
                raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=f'You must be authorized to view all reviews'
                )
        
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
        

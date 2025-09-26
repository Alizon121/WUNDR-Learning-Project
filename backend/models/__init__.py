# Import our schemas
from .user_models import User, Child
from .interaction_models import Notification, Activity, Event, Review

# Rebuild all models
User.model_rebuild()
Child.model_rebuild()
Notification.model_rebuild()
Activity.model_rebuild()
Event.model_rebuild()
Review.model_rebuild()

# Export so it's easier to import in other places
__all__ = ["User", "Child", "Notification", "Activity", "Event", "Review"]

from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'participants', ParticipantViewSet)
router.register(r'registrations', RegistrationViewSet, basename='registration')

urlpatterns = router.urls
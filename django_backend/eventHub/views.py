from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser, BasePermission, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import ReadOnly, IsOwnerPermission
from .models import Event, Participant, Registration
from .serializers import EventSerializer, ParticipantSerializer, RegistrationSerializer
from .filters import EventFilter

class EventViewSet(ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsAdminUser | ReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventFilter  


class ParticipantViewSet(ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [IsAuthenticated, IsAdminUser | ReadOnly]

    #new user registration
    def get_permissions(self):
        if self.action == 'create':
            if not self.request.user.is_authenticated or self.request.user.is_staff:
                # or is_staff si on voudrait faire un admin unique et un groupe de staff
                return [AllowAny()]
            else:
                return [IsAdminUser()]
        return super().get_permissions()

class RegistrationViewSet(ModelViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAdminUser | IsOwnerPermission]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Registration.objects.all()
        return Registration.objects.filter(participant=self.request.user)
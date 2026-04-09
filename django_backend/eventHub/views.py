from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser, BasePermission, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import ReadOnly, IsOwnerPermission #, IsRegisteredToEvent
from .models import Event, Participant, Registration
from .serializers import EventSerializer, ParticipantSerializer, RegistrationSerializer
from .filters import EventFilter
from rest_framework.decorators import action
from rest_framework.response import Response

class EventViewSet(ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsAdminUser | ReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventFilter  

    #def get_permissions(self):
    #    if self.action == 'participants':
    #        return [IsAuthenticated(), IsRegisteredToEvent()]
    #    return super().get_permissions()

    #@action(detail=True, methods=['get'], url_path='participants')
    #def participants(self, request, pk=None):
    #    event = self.get_object()
    #    self.check_object_permissions(request, event)  # force le check
    #    participants = event.participants.all()
    #    serializer = ParticipantSerializer(participants, many=True)
    #    return Response(serializer.data)

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
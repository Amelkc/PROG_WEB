from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser, BasePermission, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import ReadOnly, IsOwnerPermission, IsAdminOrSelf #, IsRegisteredToEvent
from .models import Event, Participant, Registration
from .serializers import EventSerializer, ParticipantSerializer, RegistrationSerializer
from .filters import EventFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status



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
        if self.action in ['update', 'partial_update']:
            return [IsAdminOrSelf()]
        if self.action == 'destroy':
            return [IsAdminOrSelf()]
        return super().get_permissions()
   
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def set_password(self, request, pk=None):
        """For admins changing another user's password — no old_password needed"""
        user = self.get_object()
        new = request.data.get('new_password')
        if not new or len(new) < 8:
            return Response({'new_password': 'Min 8 characters.'}, status=400)
        user.set_password(new)
        user.save()
        return Response({'status': 'Password changed.'})
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """For user changing their password — current_password needed"""
        user = request.user
        old = request.data.get('current_password')
        new = request.data.get('new_password')

        if not old or not new:
            return Response({'error': 'Both fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(old):
            return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new) < 8:
            return Response({'new_password': 'Must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new)
        user.save()
        return Response({'status': 'Password changed successfully.'})
    
    

class RegistrationViewSet(ModelViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAdminUser | IsOwnerPermission]

    def get_queryset(self):
        if self.request.user.is_staff:
            queryset = Registration.objects.all()
        else:
            queryset = Registration.objects.filter(participant=self.request.user)

        event_id = self.request.query_params.get("event")
        if event_id:
            queryset = queryset.filter(event_id=event_id)

        return queryset
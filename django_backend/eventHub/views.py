from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from .filters import EventFilter


class EventViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Event.objects.all()
        filterset = EventFilter(request.query_params, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(instance=event, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ParticipantViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Participant.objects.all()
        serializer = ParticipantSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = ParticipantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        participant = get_object_or_404(Participant, pk=pk)
        serializer = ParticipantSerializer(participant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        participant = get_object_or_404(Participant, pk=pk)
        serializer = ParticipantSerializer(instance=participant, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        participant = get_object_or_404(Participant, pk=pk)
        participant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegistrationViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Registration.objects.all()
        serializer = RegistrationSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        registration = get_object_or_404(Registration, pk=pk)
        serializer = RegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        registration = get_object_or_404(Registration, pk=pk)
        serializer = RegistrationSerializer(instance=registration, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        registration = get_object_or_404(Registration, pk=pk)
        registration.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
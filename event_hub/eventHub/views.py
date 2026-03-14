from django.shortcuts import render
from rest_framework import Response
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework import status
from .filters import EventFilter

# Create your views here.
# CRUD = Create Read Update Delete

#Event
@api_view(['POST'])
def eventCreate(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,  status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


@api_view(['GET'])
def eventList(request):
    events=Event.objects.all()
    filterset = EventFilter(request.query_params, queryset=events)
    if filterset.is_valid():
        events = filterset.qs
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data,  status=status.HTTP_200_OK) 
    

@api_view(['POST'])
def eventUpdate(request, pk):
    event=Event.objects.get(id=pk)
    serializer = EventSerializer(instance=event, data=request.data)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    


@api_view(['DELETE'])
def eventDelete(request, pk):
    event=Event.objects.get(id=pk)
    event.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



#Participant
@api_view(['POST'])
def participantCreate(request):
    serializer = ParticipantSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,  status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=400) 

@api_view(['GET'])
def participantList(request):
    participants=Participant.objects.all()
    serializer = ParticipantSerializer(participants, many=True)
    return Response(serializer.data,  status=status.HTTP_200_OK) 
    

@api_view(['POST'])
def participantUpdate(request, pk):
    participant=Participant.objects.get(id=pk)
    serializer = ParticipantSerializer(instance=participant, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    


@api_view(['DELETE'])
def participantDelete(request, pk):
    participant=Participant.objects.get(id=pk)
    participant.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


#Registration

@api_view(['POST'])
def registrationCreate(request):
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['GET'])
def registrationList(request):
    registrations=Registration.objects.all()
    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK) 
    

@api_view(['POST'])
def registrationUpdate(request, pk):
    registration=Registration.objects.get(id=pk)
    serializer = RegistrationSerializer(instance=registration, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
    


@api_view(['DELETE'])
def registrationDelete(request, pk):
    registration=Registration.objects.get(id=pk)
    registration.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

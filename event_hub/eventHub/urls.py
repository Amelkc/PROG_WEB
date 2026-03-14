from django.urls import path
from .import views

urlpatterns = [
    #event
    path('events/',              views.eventList,    name='event-list'),
    path('events/create/',       views.eventCreate,  name='event-create'),
    path('events/update/<int:pk>/', views.eventUpdate,  name='event-update'),
    path('events/delete/<int:pk>/', views.eventDelete,  name='event-delete'),
    #participant
    path('participants/',               views.participantList,   name='participant-list'),
    path('participants/create/',        views.participantCreate, name='participant-create'),
    path('participants/update/<int:pk>/', views.participantUpdate, name='participant-update'),
    path('participants/delete/<int:pk>/', views.participantDelete, name='participant-delete'),
    #registration
    path('registrations/',               views.registrationList,   name='registration-list'),
    path('registrations/create/',        views.registrationCreate, name='registration-create'),
    path('registrations/update/<int:pk>/', views.registrationUpdate, name='registration-update'),
    path('registrations/delete/<int:pk>/', views.registrationDelete, name='registration-delete'),
]


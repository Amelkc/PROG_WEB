from django.urls import path
from .import views

 
urlpatterns = [
    # Event
    path('events/',          views.event_list_create, name='event-list-create'),
    path('events/<int:pk>/', views.event_detail,      name='event-detail'),
    # Participant
    path('participants/',          views.participant_list_create, name='participant-list-create'),
    path('participants/<int:pk>/', views.participant_detail,      name='participant-detail'),
    # Registration
    path('registrations/',          views.registration_list_create, name='registration-list-create'),
    path('registrations/<int:pk>/', views.registration_detail,      name='registration-detail'),
]
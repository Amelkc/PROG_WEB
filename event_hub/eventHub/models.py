from django.db import models
from django.contrib.auth.models import AbstractUser

class Participant(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Event(models.models):
    
    
    STATUS_CHOICES = [
        ("cancelled", "Cancelled"), 
        ("postponed", "Postponed"), #date modifiée, potentielleme,nt devenue nulle 
        ("open", "Open"), #distinction avec ongoing ?
        ("closed", "Closed") 
    ]
    title = models.CharField(max_length=80)
    description = models.TextField(blank=True)
    location =  models.CharField(max_length=80)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    participants = models.ManyToManyField(
        Participant,
        through="Registration",
        related_name="events",
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="open",
    )
    def __str__(self):
        return self.title
    


class Registration(models.models):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    class Meta:
        unique_together = [["event", "participant"]]
   

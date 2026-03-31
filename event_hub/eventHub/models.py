from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

class Participant(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Event(models.Model):
    
    
    STATUS_CHOICES = [
        ("cancelled", "Cancelled"), 
        ("postponed", "Postponed"), #date modifiée, potentielleme,nt devenue nulle 
        ("open", "Open"), 
        ("closed", "Closed")  #max participant reached or end_date 
    ]
    title = models.CharField(max_length=80)
    description = models.TextField(blank=True)
    location =  models.CharField(max_length=80)
    start_datetime = models.DateTimeField(null=True, blank=True)
    end_datetime = models.DateTimeField(null=True, blank=True)
    participants = models.ManyToManyField(
        Participant,
        through="Registration",
        related_name="events",
    )
    max_participants = models.PositiveIntegerField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(1)],
        help_text="Null means unlimited"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="open",
    )
    
    def clean(self):
        '''Rule 1 : start-end can only be null together
        Rule 2 : start < end
        Rule 3 : max participants'''
        errors = {}
        if (self.start_datetime is None) != (self.end_datetime is None):
            errors["start_datetime"] = ValidationError(
                "start_datetime and end_datetime must both be set or both be null.",
                code="invalid")
            errors["end_datetime"] = ValidationError(
                "start_datetime and end_datetime must both be set or both be null.",
                code="invalid")
        if self.start_datetime and self.end_datetime:
            if self.end_datetime <= self.start_datetime:
               errors["end_datetime"] = ValidationError(
                "end_datetime must be after start_datetime.",
                code="invalid"
                )
        if (self.start_datetime is None) and (self.end_datetime is None) :
            if self.status != "postponed" :
                errors["start_datetime"] = ValidationError(
                "only postponed events should have null start_datetime",
                code="invalid")
                errors["end_datetime"] = ValidationError(
                "only postponed events should have null end_datetime",
                code="invalid")
        if errors:
            raise ValidationError(errors)
    
    def __str__(self):
        return self.title
    


class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["event", "participant"], name="unique_registration")]
    
    def clean(self):
        event = self.event
        if (event.max_participants is not None and event.participants.count() >= event.max_participants):
            raise ValidationError(
                {"participant": ValidationError(
                    "This event has reached its maximum number of participants.",
                    code="max_participants_reached"
                )}
            )


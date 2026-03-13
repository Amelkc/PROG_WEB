from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *


# Register your models here.

class ParticipantAdmin(UserAdmin):
    model = Participant
    
    # Columns shown in the participant list
    list_display = ['email', 'first_name', 'last_name', 'is_staff']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']

    # Fields shown when EDITING an existing participant
    fieldsets = (
        (None,            {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions',   {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # Fields shown when CREATING a new participant
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    
    

class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'location', 'start_datetime', 'end_datetime', 'status']  
    search_fields = ['title']
    ordering = ['start_datetime']

class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['participant', 'event', 'registered_at'] 
    search_fields = ['participant__email', 'event__title']
    
admin.site.register(Participant, ParticipantAdmin)
admin.site.register(Event, RegistrationAdmin)
admin.site.register(Registration, EventAdmin)
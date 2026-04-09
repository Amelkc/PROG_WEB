from rest_framework.permissions import BasePermission, SAFE_METHODS

class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

class IsOwnerPermission(BasePermission):
    def has_permission(self, request, view):
        # No point to check further if user is not authenticated
        if not request.user.is_authenticated:
            return False
        if view.action == 'create':
            return str(request.data.get('participant')) == str(request.user.id)
        return True

    def has_object_permission(self, request, view, obj):
        return obj.participant == request.user
    
class IsRegisteredToEvent(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated 

    def has_object_permission(self, request, view, obj) : 
        # Staff members are allowed to see all events' participants
        if request.user.is_staff:
            return True
        return obj.registration_set.filter(participant=request.user).exists()
    

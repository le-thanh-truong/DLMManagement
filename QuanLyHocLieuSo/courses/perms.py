from rest_framework import permissions

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [1, 2]

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return request.user == obj.user
        if hasattr(obj, 'created_by'):
            return request.user == obj.created_by
        if hasattr(obj, 'student'):
            return request.user == obj.student
        return False
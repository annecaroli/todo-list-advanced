from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from .filters import TaskFilter
from rest_framework.exceptions import PermissionDenied

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = TaskFilter

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
         if serializer.instance.user != self.request.user:
             raise PermissionDenied("Você não tem permissão para editar esta tarefa.")
         serializer.save()
    
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("Você não tem permissão para deletar esta tarefa.")
        instance.delete()

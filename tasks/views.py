from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all() # Retorna TODAS as tarefas, já que não há filtro por usuário
    serializer_class = TaskSerializer
    # Permissão para permitir acesso a todos os métodos (CRUD) sem autenticação
    permission_classes = [permissions.AllowAny]
    # OU para permitir acesso somente leitura para não autenticados e escrita para autenticados (mas não estamos autenticando agora):
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
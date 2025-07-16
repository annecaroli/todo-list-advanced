from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Task
        fields = ['id', 'user', 'title', 'description', 'completed', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'user']

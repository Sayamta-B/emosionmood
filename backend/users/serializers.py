from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'date_joined', 'first_name', 'last_name', 'password']
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    def update(self, instance, validated_data):
        # If updating profile_url, handle file upload
        profile_file = self.context['request'].FILES.get('profile_url')
        if profile_file:
            instance.profile_url = profile_file
        return super().update(instance, validated_data)
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'profileimage_url', 'experiences', 'skills', 'password']
        depth = 1
    
    def create(self, validated_data):
        try:
            return User.objects.create_user(
                username=validated_data['username'],
                profileimage_url=validated_data['profileimage_url'],
                password=validated_data['password']
            )
        except ValidationError as e:
            raise serializers.ValidationError({'error': list(e.messages)})


class ExperienceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Experience
        fields = ['id', 'title', 'description', 'years', 'user']


class SkillSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Skill
        fields = ['id', 'name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password']
    
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'error': 'User not found'})

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError({'error': 'Incorrect password'})

        return user
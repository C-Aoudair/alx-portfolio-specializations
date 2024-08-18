from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profileimage_url', 'experiences', 'skills']
        depth = 1
    
    def create(self, validated_data):
        try:
            return User.objects.create_user(
                username=validated_data['username'],
                profileimage_url=validated_data['profileimage_url'],
                email=validated_data['email'],
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
        fields = ['id', 'name', 'user']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username','email', 'password']
    
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = User.objects.filter(email=email).first()

        if not user:
            raise serializers.ValidationError({'error': 'User not found'})

        user = authenticate(username=user.username, password=password)
        if user is None:
            raise serializers.ValidationError({'error': 'Incorrect password'})

        return user
    

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profileimage_url', 'experiences', 'skills']
        depth = 1
        read_only_fields = ['id', 'username', 'email', 'profileimage_url', 'experiences', 'skills']

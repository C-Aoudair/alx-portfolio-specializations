from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import *
import requests
import redis

redisClient = redis.Redis()

@api_view(["GET"])
@permission_classes([AllowAny])
def apiOverview(request):
    api_urls = {
        "Register": "/register/",
        "Login": "/login/",
        "Logout": "/logout",
        "Profile": "/profile/",
        "Change Password": "/change-password/",
        "Add Skill": "/add-skill/",
        "Delete Skill": "/delete-skill/<str:pk>/",
        "Add Experience": "/add-experience/",
        "Update Experience": "/update-experience/<str:pk>/",
        "Delete Experience": "/delete-experience/<str:pk>/",
        "Update Profile Image": "/update-profile-iamge/",
    }
    return Response(api_urls)


@api_view(["POST"])
@permission_classes([AllowAny])
def regester(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=serializer.data["email"])
        data = ProfileSerializer(user).data
        refresh = RefreshToken.for_user(user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        redisClient.setex(data["id"], 86400, "logged")
        requests.post(
            'http://localhost:4000/create-user',
            json={
                'name': data['username'],
                'userId': data['id'],
                'online': True,
                'connections': []
            }
        )
        return Response({"data": data}, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.get(email=serializer.data["email"])
        data = ProfileSerializer(user).data
        refresh = RefreshToken.for_user(user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        redisClient.setex(data["id"], 86400, "logged")
        return Response({"data": data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
    except (AttributeError, ObjectDoesNotExist):
        pass
    return Response({"message": "Logout successfully"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    password = request.data["password"]
    user.set_password(password)
    user.save()
    return Response(
        {"message": "Password changed successfully"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_skill(request):
    skill = SkillSerializer(data=request.data)
    if skill.is_valid():
        skill.save()
        new_skill = skill.instance
        user = request.user
        user.skills.add(new_skill)
        return Response({"newSkill": skill.data}, status=status.HTTP_201_CREATED)
    return Response(skill.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_skill(request, pk):
    skill = Skill.objects.get(id=pk)
    user = request.user
    user.skills.remove(skill)
    return Response(
        {"message": "Skill deleted successfully"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_experience(request):
    experience_data = request.data
    experience_data["user"] = request.user.id
    experience = ExperienceSerializer(data=request.data)
    if experience.is_valid():
        experience.save()
        return Response(
            {"newExperience": experience.data}, status=status.HTTP_201_CREATED
        )
    return Response(experience.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_experience(request, pk):
    print(request.data)
    experience = Experience.objects.get(id=pk)
    experience_data = request.data
    experience = ExperienceSerializer(
        instance=experience, data=experience_data["newExperience"]
    )
    if experience.is_valid():
        experience.save()
        return Response(
            {"editedExperience": experience.data}, status=status.HTTP_201_CREATED
        )
    return Response(experience.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_experience(request, pk):
    try:
        experience = Experience.objects.get(id=pk)
        experience.delete()
        return Response(
            {"message": "Experience deleted successfully"}, status=status.HTTP_200_OK
        )
    except ObjectDoesNotExist:
        return Response(
            {"message": "Experience does not exist"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_profile_image(request):
    url_image = request.data["url_image"]
    if not url_image:
        return Response(
            {"message": "Url image is required"}, status=status.HTTP_400_BAD_REQUEST
        )
    user = request.user
    user.url_image = url_image
    user.save()
    return Response(
        {"message": "Profile image updated successfully"}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search(request):
    skill = request.query_params.get("query")
    users = User.objects.filter(skills__name=skill).exclude(id=request.user.id)
    if users:
        users = ProfileSerializer(users, many=True).data
        return Response({"users": users}, status=status.HTTP_200_OK)
    return Response(
        {"message": "No user found with the given skill"},
        status=status.HTTP_404_NOT_FOUND,
    )

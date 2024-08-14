from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import *


@api_view(['GET'])
@permission_classes([AllowAny])
def apiOverview(request):
    api_urls = {
        'Register': '/register/',
        'Login': '/login/',
        'Logout': '/logout',
        'Profile': '/profile/',
        'Change Password': '/change-password/',
        'Add Skill': '/add-skill/',
        'Delete Skill': '/delete-skill/<str:pk>/',
        'Add Experience': '/add-experience/',
        'Delete Experience': '/delete-experience/<str:pk>/',
        'Update Profile Image': '/update-profile-iamge/',
    }
    return Response(api_urls)


@api_view(['POST'])
@permission_classes([AllowAny])
def regester(request):
    user = RegisterSerializer(data=request.data)
    if user.is_valid():
        user.save()
        data = user.data
        refresh = RefreshToken.for_user(user.instance)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return Response(data, status=status.HTTP_201_CREATED)
    return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
    except (AttributeError, ObjectDoesNotExist):
        pass
    return Response(
        {'message': 'Logout successfully'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    password = request.data['password']
    user.set_password(password)
    user.save()
    return Response(
        {'message': 'Password changed successfully'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_skill(request):
    skill = SkillSerializer(data=request.data)
    if skill.is_valid():
        skill.save()
        return Response(skill.data, status=status.HTTP_201_CREATED)
    return Response(skill.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_skill(request, pk):
    skill = Skill.objects.get(id=pk)
    skill.delete()
    return Response(
        {'message': 'Skill deleted successfully'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_experience(request):
    experience = ExperienceSerializer(data=request.data)
    if experience.is_valid():
        experience.save()
        return Response(experience.data, status=status.HTTP_201_CREATED)
    return Response(experience.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_experience(request, pk):
    experience = Experience.objects.get(id=pk)
    experience.delete()
    return Response(
        {'message': 'Experience deleted successfully'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_image(request):
    url_image = request.data['url_image']
    if not url_image:
        return Response(
            {'message': 'Url image is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    user = request.user
    user.url_image = url_image
    user.save()
    return Response(
        {'message': 'Profile image updated successfully'},
        status=status.HTTP_200_OK
    )
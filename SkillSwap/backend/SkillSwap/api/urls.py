from django.urls import path
from .views import *


urlpatterns = [
    path('', apiOverview, name='api-overview'),
    path('register/', regester, name='register'),
    path('login/', login, name='login'),
    path('profile/', profile, name='profile'),
    path('logout/', logout, name='logout'),
    path('change-password/', change_password, name='change-password'),
    path('add-skill/', add_skill, name='add-skill'),
    path('delete-skill/<str:pk>/', delete_skill, name='delete-skill'),
    path('add-experience/', add_experience, name='add-experience'),
    path('delete-experience/<str:pk>/', delete_experience, name='delete-experience'),
    path('update-profile-iamge/', update_profile_image, name='update-profile-image'),
]
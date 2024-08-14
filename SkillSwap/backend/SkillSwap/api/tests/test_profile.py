# tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User, Skill, Experience


class UserTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword123"
        )
        self.skill = Skill.objects.create(name="Python")
        self.skill.users.add(self.user)
        self.experience = Experience.objects.create(
            title="Developer",
            description="this is my first skill",
            years=2,
            user=self.user,
        )
        self.add_skill_url = reverse("add-skill")
        self.delete_skill_url = reverse("delete-skill", args=[self.skill.id])
        self.add_experience_url = reverse("add-experience")
        self.delete_experience_url = reverse(
            "delete-experience", args=[self.experience.id]
        )
        self.update_profile_image_url = reverse("update-profile-image")
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    def test_add_skill_success(self):
        response = self.client.post(self.add_skill_url, {"name": "Django"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_skill_failure(self):
        response = self.client.post(self.add_skill_url, {"name": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_skill_success(self):
        response = self.client.delete(self.delete_skill_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_skill_failure(self):
        with self.assertRaises(Skill.DoesNotExist):
            self.client.delete(reverse("delete-skill", args=[999]))

    def test_add_experience_success(self):
        response = self.client.post(
            self.add_experience_url,
            {
                "title": "Engineer",
                "years": 3,
                "description": "this is my second skill",
                "user": self.user.id,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_experience_failure(self):
        response = self.client.post(self.add_experience_url, {"title": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_experience_success(self):
        response = self.client.delete(self.delete_experience_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_experience_failure(self):
        with self.assertRaises(Experience.DoesNotExist):
            self.client.delete(reverse("delete-experience", args=[999]))

    def test_update_profile_image_success(self):
        response = self.client.post(
            self.update_profile_image_url, {"url_image": "http://example.com/image.jpg"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Profile image updated successfully")

    def test_update_profile_image_failure(self):
        response = self.client.post(self.update_profile_image_url, {"url_image": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

from django.test import TestCase
from rest_framework.test import APIClient
from ..models import *
from ..serializer import *
from django.contrib.auth import get_user_model


class TestSerializers(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.client = APIClient()

        # Create users for testing
        self.user = self.User.objects.create_user(
            username="testuser",
            password="testpassword",
            profileimage_url="http://example.com/image.jpg",
        )
        self.user2 = self.User.objects.create_user(
            username="testuser2", password="testpassword2"
        )

        # Create instances of Experience and Skill for testing
        self.experience = Experience.objects.create(
            user=self.user,
            title="Software Engineer",
            years=5,
            description="Worked on various projects",
        )
        self.skill = Skill.objects.create(name="Python")
        self.skill.users.add(self.user, self.user2)

    def test_user_serializer_create(self):
        data = {
            "username": "newuser",
            "profileimage_url": "http://example.com/newimage.jpg",
            "password": "newpassword",
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, "newuser")
        self.assertTrue(user.check_password("newpassword"))
        self.assertEqual(
            user.profileimage_url,
            "http://example.com/newimage.jpg"
        )

    def test_user_serializer_invalid(self):
        data = {
            "username": "invaliduser",
            "profileimage_url": "http://example.com/invalidimage.jpg",
            # Missing password field
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
        print(serializer.errors)

    def test_experience_serializer(self):
        serializer = ExperienceSerializer(self.experience)
        data = serializer.data
        self.assertEqual(data["title"], "Software Engineer")
        self.assertEqual(data["years"], 5)
        self.assertEqual(data["description"], "Worked on various projects")

    def test_skill_serializer(self):
        serializer = SkillSerializer(self.skill)
        data = serializer.data
        self.assertEqual(data["name"], "Python")

    def test_login_serializer_valid(self):
        data = {"username": "testuser", "password": "testpassword"}
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.validated_data
        self.assertEqual(user.username, "testuser")

    def test_login_serializer_invalid(self):
        # Incorrect password
        data = {"username": "testuser", "password": "wrongpassword"}
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        err_message = str(serializer.errors["error"][0])
        self.assertEqual(err_message, "Incorrect password")

        # Nonexistent user
        data = {"username": "nonexistentuser", "password": "password"}
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        err_message = str(serializer.errors["error"][0])
        self.assertEqual(err_message, "User not found")
        print(serializer.errors)

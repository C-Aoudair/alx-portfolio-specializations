from django.test import TestCase
from django.urls import reverse
from ..models import *
from ..serializer import *
from django.contrib.auth import get_user_model


class TestModels(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user1 = self.User.objects.create_user(
            username="testuser1", password="testpassword1"
        )
        self.user2 = self.User.objects.create_user(
            username="testuser2", password="testpassword2"
        )
        self.experience = Experience.objects.create(
            user=self.user1,
            title="Software Engineer",
            years=5,
            description="Worked on various projects",
        )
        self.skill = Skill.objects.create(name="Python")
        self.skill.users.add(self.user1, self.user2)

    def test_user_creation(self):
        user = self.User.objects.get(username="testuser1")
        self.assertEqual(user.username, "testuser1")
        self.assertTrue(user.check_password("testpassword1"))

    def test_experience_creation(self):
        experience = Experience.objects.get(title="Software Engineer")
        self.assertEqual(experience.title, "Software Engineer")
        self.assertEqual(experience.years, 5)
        self.assertEqual(experience.description, "Worked on various projects")
        self.assertEqual(experience.user, self.user1)

    def test_skill_creation(self):
        skill = Skill.objects.get(name="Python")
        self.assertEqual(skill.name, "Python")
        self.assertIn(self.user1, skill.users.all())
        self.assertIn(self.user2, skill.users.all())
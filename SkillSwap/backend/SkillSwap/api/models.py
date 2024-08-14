from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    profileimage_url = models.URLField(max_length=200, blank=True, null=True)


class Experience(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name="experiences"
    )
    title = models.CharField(max_length=100)
    years = models.PositiveIntegerField()
    description = models.TextField()


class Skill(models.Model):
    name = models.CharField(max_length=100)
    users = models.ManyToManyField(User, related_name="skills")

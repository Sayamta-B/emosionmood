from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    profile_url = models.TextField(blank=True, null=True, default='uploads/defaultProfile.jpg')

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']

    email = models.EmailField(unique=True)
# default fields like username, email, password, first_name, last_name, date_join, last_login
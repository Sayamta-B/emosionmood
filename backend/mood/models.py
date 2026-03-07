from django.db import models
from users.views import User
from posts.views import Post

class MoodDetection(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('neutral', 'Neutral'),
        ('sad', 'Sad'),
        ('surprise', 'Surprise'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    mood = models.CharField(max_length=10, choices=MOOD_CHOICES, null=True, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
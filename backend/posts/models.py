from django.db import models
from users.models import User

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_path = models.TextField()
    bookmark = models.BooleanField(default=False)
    tracks = models.ManyToManyField('Track', related_name='posts', blank=True)  # multiple tracks
    created_at = models.DateTimeField(auto_now_add=True)

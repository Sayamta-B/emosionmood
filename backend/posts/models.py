from django.db import models

class Post(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    image_path = models.TextField()
    bookmark = models.BooleanField(default=False)
    tracks = models.ManyToManyField('spotify.Track', related_name='spotify', blank=True)  # multiple tracks
    created_at = models.DateTimeField(auto_now_add=True)

from django.db import models
from users.models import User
from mood.models import MoodDetection


class Track(models.Model):
    spotify_id = models.CharField(unique=True, max_length=50)
    name = models.TextField()
    artists = models.JSONField(null=True, blank=True)  # structured array of artists
    album = models.TextField()
    duration_ms = models.IntegerField()
    genre = models.CharField(max_length=50, null=True, blank=True)
    image_url = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class TrackFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'track'], name='unique_user_track_favorite')
        ]

class ListeningHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    listen_count = models.IntegerField(default=0)
    last_listened_at = models.DateTimeField(auto_now=True)
    mood = models.CharField(max_length=10, choices=MoodDetection.MOOD_CHOICES, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'track'], name='unique_user_track_history')
        ]

from django.contrib import admin
from .models import Track

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display=("name", "artists", "album", "mood", "spotify_id",)
    search_fields=("name", "artists", "album", "mood", "spotify_id",)

    fields = (
        "name",
        "artists",
        "album",
        "mood",
        "spotify_id",
    )
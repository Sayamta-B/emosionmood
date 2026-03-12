from django.contrib import admin
from .models import Track

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display=("name", "artists", "album", "mood", "embed_url",)
    search_fields=("name", "artists", "album", "mood", "embed_url",)

    fields = (
        "name",
        "artists",
        "album",
        "mood",
        "embed_url",
    )
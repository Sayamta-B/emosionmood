from .models import Track

def recommend_song_for_mood(mood: str, num_tracks: int = 5):
    """
    Return a list of recommended tracks based on the given mood after retrieving from db.
    Each track includes id, name, artists, album, and embed URL.
    """
    recommendations=Track.objects.filter(mood=mood).order_by('?')[:num_tracks]
    return [{
        "id": t.id,
        "name": t.name,
        "artists": t.artists,
        "album" : t.album,
        "mood" : t.mood,
        "spotify_id" : t.spotify_id,
    }
    for t in recommendations
    ]

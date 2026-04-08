from django.shortcuts import render
from rest_framework.decorators import api_view
from spotify.utils import recommend_song_for_mood
from django.http import JsonResponse
from django.utils import timezone
from spotify.models import Track, ListeningHistory, TrackFavorite
from rest_framework.response import Response

@api_view(['GET'])
def get_recommendation(request):
    '''
    Returns recomended songs
    '''
    mood = request.GET.get("mood")
    if not mood:
        return JsonResponse({"error": "Mood is required, example: /recommend_song_for_mood/?mood=happy"}, status=400)
    recommendations = recommend_song_for_mood(mood)
    return JsonResponse({"recommendations": recommendations})


@api_view(['POST'])
def track_played(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=401)

    data = request.data
    spotify_id = data.get("spotify_id")

    if not spotify_id:
        return Response({"error": "No track ID provided"}, status=400)

    try:
        track = Track.objects.get(spotify_id=spotify_id)
    except Track.DoesNotExist:
        return Response({"error": "Track not found"}, status=404)

    mood = track.mood

    # update or create listening history
    history, created = ListeningHistory.objects.get_or_create(
        user=user,
        track=track,
        defaults={"listen_count": 1, "mood": mood}
    )

    if not created:
        history.listen_count += 1
        history.last_listened_at = timezone.now()
        if mood:
            history.mood = mood
        history.save()

    return Response({
        "track": track.name,
        "listen_count": history.listen_count,
        "last_listened_at": history.last_listened_at,
        "mood": history.mood
    })


@api_view(["POST"])
def toggle_favorite(request):
    """
    Toggle favorite for a track for the current user.
    """
    user = request.user
    spotify_id = request.data.get("spotify_id")
    if not spotify_id:
        return Response({"error": "No track ID provided"}, status=400)

    try:
        track = Track.objects.get(spotify_id=spotify_id)
    except Track.DoesNotExist:
        return Response({"error": "Track not found"}, status=404)

    favorite, created = TrackFavorite.objects.get_or_create(user=user, track=track)

    if not created:
        # Already exists → remove
        favorite.delete()
        is_favorite = False
    else:
        is_favorite = True

    return Response({"spotify_id": spotify_id, "is_favorite": is_favorite})

@api_view(["GET"])
def is_favorite(request, spotify_id):
    user = request.user
    try:
        track = Track.objects.get(spotify_id=spotify_id)
    except Track.DoesNotExist:
        return Response({"error": "Track not found"}, status=404)

    exists = TrackFavorite.objects.filter(user=user, track=track).exists()
    return Response({"is_favorite": exists})


@api_view(["GET"])
def get_favorites(request):
    user = request.user
    favorites = TrackFavorite.objects.filter(user=user).select_related("track")
    favorite_tracks = [{"name": f.track.name, "artists":f.track.artists, "spotify_id": f.track.spotify_id} for f in favorites]
    return Response(favorite_tracks)

@api_view(["GET"])
def get_history(request):
    user = request.user
    history = ListeningHistory.objects.filter(user=user).select_related("track").order_by("-last_listened_at")
    tracks_history = [
        {"name": h.track.name, "spotify_id": h.track.spotify_id, "count": h.listen_count} 
        for h in history
    ]
    return Response(tracks_history)
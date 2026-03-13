from django.shortcuts import render
from rest_framework.decorators import api_view
from spotify.utils import recommend_song_for_mood
from django.http import JsonResponse
from django.utils import timezone
from spotify.models import Track, ListeningHistory
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
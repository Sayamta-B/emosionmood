from django.shortcuts import render
from rest_framework.decorators import api_view
from spotify.utils import recommend_song_for_mood
from django.http import JsonResponse

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



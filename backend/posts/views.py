from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Post, Track
from django.views.decorators.csrf import csrf_exempt
import base64

@csrf_exempt
def get_posts(request):
    email = request.GET.get("email")
    print("Received email:", email)

    if email:
        posts = Post.objects.filter(user__email=email).order_by('-created_at')
        print("Filtering posts by email:", email)
    else:
        posts = Post.objects.all().order_by('-created_at')
        print("Fetching all posts")

    print("Number of posts fetched:", posts.count())

    data = []
    for post in posts:
        print(f"\nPost ID: {post.id}")
        print(f"User: {post.user.username} ({post.user.email})")
        print(f"Image path: {post.image_path}")
        tracks_list = []
        for t in post.tracks.all():
            track_info = {
                "id": t.id,
                "spotify_id": t.spotify_id,
                "name": t.name,
                "artists": t.artists if t.artists else [],
                "image_url": t.image_url
            }
            tracks_list.append(track_info)
            print(" Track:", track_info)

        post_data = {
            "id": post.id,
            "user": {
                "id": post.user.id,
                "username": post.user.username,
                "profile_url": post.user.profile_url,
            },
            "image_path": post.image_path,
            "tracks": tracks_list
        }
        data.append(post_data)
        print("Post data to return:", post_data)

    print("\nFinal data sent to frontend:", data)
    return JsonResponse(data, safe=False)



@csrf_exempt
@api_view(['POST'])
def create_post(request):
    data = request.data
    user_id = data.get("user_id")
    image_url = data.get("image")
    songs = data.get("songs", [])

    # Get user from frontend-provided ID
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Create post
    post = Post.objects.create(user=user, image_path=image_url or "")
    saved_tracks = []

    for s in songs:
        spotify_id = s.get("spotify_id")
        if not spotify_id:
            continue

        track_obj, created = Track.objects.get_or_create(
            spotify_id=spotify_id,
            defaults={
                "name": s.get("name",""),
                "artists": s.get("artists", []),
                "album": s.get("album",""),
                "duration_ms": s.get("duration_ms",0),
                "image_url": s.get("image_url",""),
                "genre": s.get("genre","")
            }
        )

        if not created:
            # Update existing track info
            track_obj.name = s.get("name", track_obj.name)
            track_obj.artists = s.get("artists", track_obj.artists)
            track_obj.album = s.get("album", track_obj.album)
            track_obj.duration_ms = s.get("duration_ms", track_obj.duration_ms)
            track_obj.image_url = s.get("image_url", track_obj.image_url)
            track_obj.genre = s.get("genre", track_obj.genre)
            track_obj.save()

        post.tracks.add(track_obj)
        saved_tracks.append(track_obj.spotify_id)

    post.save()
    return Response({"post_id": post.id, "saved_tracks": saved_tracks}, status=201)

@csrf_exempt
@api_view(['POST'])
def save_mood(request):
    user_id = request.data.get("user_id")
    post_id = request.data.get("post_id")
    mood = request.data.get("mood")
    confidence = request.data.get("confidence")

    if not user_id or not post_id:
        return Response({"error": "Missing user_id or post_id"}, status=400)

    try:
        user = User.objects.get(id=user_id)
        post = Post.objects.get(id=post_id)
    except:
        return Response({"error": "User or Post not found"}, status=404)

    mood_obj = MoodDetection.objects.create(
        user=user,
        post=post,
        mood=mood,
        confidence=confidence
    )

    return Response({"mood_id": mood_obj.id}, status=201)


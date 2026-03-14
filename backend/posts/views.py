from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import User 
from posts.models import Post 
from spotify.models import Track




@api_view(['POST'])
def create_post(request):
    '''
    Returns created post id and saved_tracks for debugging in console.log
    Saves post data (user and image) and tracks data
    '''
    print("yes i m here your saviour")
    data = request.data
    image_url = data.get("image")
    songs = data.get("songs", [])

    user=request.user

    if not user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=401)

    post = Post.objects.create(user=user, image_path=image_url or "")

    saved_tracks = []
    for s in songs:
        spotify_id = s.get("spotify_id")
        if not spotify_id:
            continue

        track, created = Track.objects.get_or_create(
            spotify_id=spotify_id,
            defaults={
                "name": s.get("name"),
                "artists": s.get("artists"),
                "mood": s.get("mood"),
            }
        )

        post.tracks.add(track)
        saved_tracks.append(track.spotify_id)

    post.save()
    return Response({"post_id": post.id, "saved_tracks": saved_tracks}, status=201)



@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.filter(user=request.user).order_by('-created_at')

    data = []

    for post in posts:
        tracks_list = []
        for t in post.tracks.all():
            tracks_list.append({
                "id": t.id,
                "spotify_id": t.spotify_id,
                "name": t.name,
                "artists": t.artists or [],
                "image_url": t.image_url,
                "mood": t.mood,
            })

        data.append({
            "id": post.id,
            "user": {
                "id": post.user.id,
                "username": post.user.username,
                "profile_url": post.user.profile_url,
            },
            "image_path": post.image_path,
            "bookmark": post.bookmark,
            "tracks": tracks_list
        })
        print("lalalalalalalal"+post.user.profile_url);

    return Response(data)


@api_view(["DELETE"])
def delete_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    if post.user != user:
        return Response({"error": "Not allowed"}, status=403)

    post.delete()
    return Response({"success": True})


@api_view(["POST"])
def toggle_bookmark(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    # Toggle bookmark boolean
    post.bookmark = not post.bookmark
    post.save()

    return Response({"bookmark": post.bookmark})
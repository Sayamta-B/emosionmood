from django.shortcuts import render
from .mood_cnn import model, device, inference_transform, idx_to_class
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.utils import timezone
from PIL import Image
import torch
from django.core.files.base import ContentFile

from users.models import User
from posts.models import Post
from .models import MoodDetection


@api_view(['POST'])
def predict(request):
    image = request.FILES.get("image")
    if not image:
        return Response({"error": "No image provided"}, status=400)
    try:
        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
        safe_name = f"{timestamp}_{image.name}"
        saved_name = default_storage.save(f"uploads/{safe_name}", ContentFile(image.read()))
        media_url = default_storage.url(saved_name)
        image_url = request.build_absolute_uri(media_url)
    except Exception:
        return Response({"error": "Image save failed"}, status=500)

    try:
        img = Image.open(image).convert("L")
    except Exception:
        img = Image.open(default_storage.open(saved_name)).convert("L")

    img_tensor = inference_transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(img_tensor)
        probs = torch.softmax(output, dim=1)
        pred_idx = torch.argmax(probs, dim=1).item()
        confidence = round(float(probs[0, pred_idx].cpu().item()) * 100, 2)
    mood = idx_to_class.get(pred_idx, "neutral")
    return Response({"mood": mood, "confidence": confidence, "image_url": image_url})



@api_view(['POST'])
def save_mood(request):
    post_id = request.data.get("post_id")
    mood = request.data.get("mood")
    confidence = request.data.get("confidence")

    user=request.user
    if not user.is_authenticated or not post_id:
        return Response({"error": "Missing user_id or post_id"}, status=400)

    try:
        post = Post.objects.get(id=post_id)
    except:
        return Response({"error": "Post not found"}, status=404)

    mood_obj = MoodDetection.objects.create(
        user=user,
        post=post,
        mood=mood,
        confidence=confidence
    )

    return Response({"mood_id": mood_obj.id}, status=201)



@api_view(["GET"])
def get_user_moods(request):
    user = request.user
    moods = MoodDetection.objects.filter(user=user).order_by('-created_at')
    
    # Return simple JSON stats without serializers
    mood_counts = {}
    for choice, _ in MoodDetection.MOOD_CHOICES:
        mood_counts[choice] = moods.filter(mood=choice).count()
    
    return Response({
        "total_moods": moods.count(),
        "mood_counts": mood_counts,
    })
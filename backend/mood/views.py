from django.shortcuts import render
from .mood_cnn import model, device, inference_transform, idx_to_class
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.utils import timezone
from PIL import Image
import torch
from django.core.files.base import ContentFile


from spotify.utils import recommend_song_for_mood

# separate the predict and song logic ^^
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
    recommendations = recommend_song_for_mood(mood)
    return Response({"mood": mood, "confidence": confidence, "recommendations": recommendations, "image_url": image_url})


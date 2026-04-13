from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer, UserSerializer
from .models import User


# ---------------------------
# CSRF
# ---------------------------
@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})


# ---------------------------
# REGISTER
# ---------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response({
            "message": "Registered successfully",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------
# LOGIN
# ---------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)

        if user:
            login(request, user)
            return Response({
                "message": "Logged in successfully",
                "user": UserSerializer(user).data
            })

        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------
# CURRENT USER (FIXED)
# ---------------------------
def me_view(request):
    user = request.user

    if not user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "date_joined": user.date_joined,
        "first_name": user.first_name,
        "last_name": user.last_name,

        # ✅ FIX: ImageField must be converted to URL string
        "profile_url": (
            user.profile_url.url
            if user.profile_url
            else "/media/uploads/defaultProfile.jpg"
        )
    })


# ---------------------------
# LOGOUT
# ---------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"detail": "Successfully logged out"}, status=200)


# ---------------------------
# UPDATE USER
# ---------------------------
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user

    serializer = UserSerializer(
        user,
        data=request.data,
        partial=True,
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save()

        return Response({
            "message": "Profile updated successfully",
            "user": serializer.data
        }, status=200)

    return Response(serializer.errors, status=400)
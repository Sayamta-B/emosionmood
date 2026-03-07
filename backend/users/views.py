from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer, UserSerializer


@ensure_csrf_cookie
def get_csrf(request):
    '''
    Returns detail that csrf cookie has been set.
    CSRF: Cross Site Request Forgery
    It can be prevented if server provides csrf token to ensure that request is from the trusted site
    '''
    csrf_token = request.META.get("CSRF_COOKIE") 
    print(csrf_token)
    return JsonResponse({"detail": "CSRF cookie set"})


@api_view(['POST'])
@permission_classes([AllowAny])  # allow anyone to register
def register_view(request):
    """
    Function-based view for user registration.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {
                "message": "Registered successfully",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    '''
    Returns user and status of the login.
    Uses serialization to validate the data and authenticate to check if the user is authorized
    '''
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
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def me_view(request):
    """
    Returns the currently logged-in user based on session.
    Frontend can call this to check authentication status.
    """
    user = request.user
    
    if not user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)
    
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    '''
    Returns detail of sucessful logout, end session
    '''
    if request.user.is_authenticated:
        logout(request)
        return Response({"detail": "Successfully logged out"}, status=200)
    return Response({"detail": "Already logged out"}, status=200)
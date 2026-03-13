from django.urls import path
from . import views

urlpatterns = [
    path("get_recommendation/", views.get_recommendation),
    path("played/", views.track_played),
    path("is_favorite/<str:spotify_id>/", views.is_favorite),
    path("toggle_favorite/", views.toggle_favorite),
]

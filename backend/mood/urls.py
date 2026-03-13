from django.urls import path
from . import views

urlpatterns = [
    path("predict/", views.predict),
    path("save_mood/", views.save_mood),
]

from django.urls import path
from . import views

urlpatterns = [
    path("get_posts/", views.get_posts),
    path("create_post/", views.create_post),
]

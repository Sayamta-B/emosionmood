from django.urls import path
from . import views

urlpatterns = [
    path("get_posts/", views.get_posts),
    path("create_post/", views.create_post),
    path("<int:post_id>/delete/", views.delete_post),
    path("<int:post_id>/bookmark/", views.toggle_bookmark),
]

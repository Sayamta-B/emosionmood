from django.urls import path
from . import views

urlpatterns = [
    path("get_csrf/", views.get_csrf),
    path("me/", views.me_view),
    path("register/", views.register_view),
    path("login/", views.login_view),
    path("logout/", views.logout_view),
    path("update/", views.update_user),
]

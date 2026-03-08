from django.urls import path
from . import views

urlpatterns = [
    path("/get_recommendation", views.get_recommendation),
]

from django.urls import path
from .views import RoomView, CreateRoomView

urlpatterns = [
  path('room', RoomView.as_view()), #as_view gives view form of class
  path('create-room', CreateRoomView.as_view()),
]
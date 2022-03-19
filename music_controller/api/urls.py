from django.urls import path
from .views import GetRoom, JoinRoom, RoomView, CreateRoomView

urlpatterns = [
  path('room', RoomView.as_view()), #as_view gives view form of class
  path('create-room', CreateRoomView.as_view()),
  path('get-room', GetRoom.as_view()),
  path('join-room', JoinRoom.as_view()),
]
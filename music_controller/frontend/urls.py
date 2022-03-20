from django.urls import path
from .views import index

app_name = 'frontend' # MUST DO SO DJANGO KNOWS THIS URLS BELONGS TO FRONTEND *ASSOCIATED WITH AUTH FLOW*

urlpatterns = [
  path('', index, name=''),
  path('join/', index),
  path('create/', index),
  path('room/<str:roomCode>', index),
]

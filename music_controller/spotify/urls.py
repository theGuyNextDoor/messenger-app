from django.urls import path
from .views import AuthURL, IsAuthenticated, spotify_cb

urlpatterns = [
  path('get-auth-url', AuthURL.as_view()),
  path('redirect', spotify_cb), # RUNS FUNC TO SEND PATH TO FRONT END, THEN... go to frontend urls
  path('is-authenticated', IsAuthenticated.as_view()),
]

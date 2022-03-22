from django.urls import path
from .views import *

urlpatterns = [
  path('spotify-token', SpotifyTokenView.as_view()),
  path('revoke-spotify-token', RevokeToken.as_view()),
  path('get-auth-url', AuthURL.as_view()),
  path('redirect', spotify_cb), # RUNS FUNC TO SEND PATH TO FRONT END, THEN... go to frontend urls
  path('is-authenticated', IsAuthenticated.as_view()),
  path('current-song', CurrentSong.as_view()),
  path('pause', PauseSong.as_view()),
  path('play', PlaySong.as_view()),
  path('skip', SkipSong.as_view()),
]

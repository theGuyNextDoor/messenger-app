from django.shortcuts import render, redirect
from requests import Request, post
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, BASIC_AUTH
from .util import update_or_create_user_tokens, is_spotify_authenticated

# Create your views here.

# FRONT END CALLS THIS, THEN...
class AuthURL(APIView):
  def get(self, request, format=None):
    scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
    config = {
      'scope': scopes,
      'response_type': 'code',
      'redirect_uri': REDIRECT_URI,
      'client_id': CLIENT_ID,
    }

    # returns url for frontend to use
    url = Request('GET', 'https://accounts.spotify.com/authorize', params=config).prepare().url

    return Response({'url': url}, status=status.HTTP_200_OK) # GIVES REDIRECT URL TO FRONTEND, THEN...


# REDIRECTTS BACK TO HERE, THEN...
def spotify_cb(request, format=None):
  code = request.GET.get('code')
  # error = request.GET.get('error')
  config = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
  }

  response = post('https://accounts.spotify.com/api/token', data=config).json()

  access_token = response.get('access_token')
  refresh_token = response.get('refresh_token')
  token_type = response.get('token_type')
  expires_in = response.get('expires_in')
  error = response.get('error')

  if not request.session.exists(request.session.session_key):
    request.session.create()

  update_or_create_user_tokens(request.session.session_key, access_token, refresh_token, token_type, expires_in)

  return redirect('frontend:') # REDIRECT BACK TO APPLICATION WITH AUTHENTICATION CREDENTIALS, THEN... check urls

class IsAuthenticated(APIView):
  def get(self, request, format=None):
    is_authenticated = is_spotify_authenticated(self.request.session.session_key)
    return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

# class CurrentSong(APIView):
#   def get(self, requet, format=None):
#     room_code = self.request.session.get['room-code']
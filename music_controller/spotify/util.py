from os import access
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post
from .credentials import CLIENT_ID, CLIENT_SECRET

def get_user_tokens(session_key):
  user_token = SpotifyToken.objects.filter(user=session_key)
  if user_token.exists():
    return user_token[0]
  return None

def update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in):
  tokens = get_user_tokens(session_key)
  expires_in = timezone.now() + timedelta(seconds=expires_in)

  if tokens:

    print('IF TOKENS DOT ', tokens.session_key) # DELETE ME ---------------------------------
    print('IF TOKENS ', session_key) # DELETE ME ---------------------

    tokens.access_token = access_token
    tokens.refresh_token = refresh_token #doesnt work
    # refresh_token = tokens.refresh_token (works)
    tokens.token_type = token_type
    tokens.expires_in = expires_in
    tokens.save(update_fields=['access_token', 'refresh_token', 'token_type', 'expires_in'])
  else:

    print('WENT TO ELSE') # DELETE ME ----------------------------------------------------

    tokens = SpotifyToken(user=session_key, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
    tokens.save()

def refresh_spotify_token(session_key):
  refresh_token = get_user_tokens(session_key).refresh_token
  config = {
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
  }

  response = post('https://accounts.spotify.com/api/token', data=config).json()

  access_token = response.get('access_token')
  refresh_token = response.get('refresh_token')
  token_type = response.get('token_type')
  expires_in = response.get('expires_in')

  update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in)

def is_spotify_authenticated(session_key):
  tokens = get_user_tokens(session_key)

  if tokens:
    expiry = tokens.expires_in

    if expiry <= timezone.now():
      refresh_spotify_token(session_key)

    return True
  return False


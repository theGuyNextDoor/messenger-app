from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .credentials import CLIENT_ID, CLIENT_SECRET

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_key):
  user_token = SpotifyToken.objects.filter(user=session_key)
  if user_token.exists():
    return user_token[0]
  return None

def update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in):
  tokens = get_user_tokens(session_key)
  expires_in = timezone.now() + timedelta(seconds=expires_in)

  if tokens:
    tokens.access_token = access_token
    tokens.refresh_token = refresh_token
    tokens.token_type = token_type
    tokens.expires_in = expires_in
    tokens.save(update_fields=['access_token', 'refresh_token', 'token_type', 'expires_in'])
  else:
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

  print('RESPONSE', response) # DELETE ME ---------------------------------------------------

  access_token = response.get('access_token')
  token_type = response.get('token_type')
  expires_in = response.get('expires_in')

  update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in)

def is_spotify_authenticated(session_key):
  token_results = SpotifyToken.objects.filter(user=session_key)
  if len(token_results) == 0:
    return False

  tokens = get_user_tokens(session_key)

  if tokens:
    expiry = tokens.expires_in

    if expiry <= timezone.now():
      refresh_spotify_token(session_key)

    return True
  return False

def execute_spotify_request(session_key, endpoint, post_=False, put_=False): # Router for spotify endpoints
  tokens = get_user_tokens(session_key)
  headers = {
    'Content-Type': 'application/json',
    "Authorization": 'Bearer ' + tokens.access_token,
  }

  if post_:
    post(BASE_URL + endpoint, headers=headers)
  if put_:
    put(BASE_URL + endpoint, headers=headers)

  response = get(BASE_URL + endpoint, {}, headers=headers)
  try:
    return response.json()
  except:
    return {'Error': 'Issue with request'}
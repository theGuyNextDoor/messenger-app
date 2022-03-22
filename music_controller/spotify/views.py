from django.shortcuts import render, redirect
from requests import Request, post
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import SpotifyTokenSerializer
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, BASIC_AUTH
from .util import *
from .models import SpotifyToken, Votes
from api.models import Room

class SpotifyTokenView(generics.ListAPIView): # creates a layout for you also use CreateAPIView
  queryset = SpotifyToken.objects.all()
  serializer_class = SpotifyTokenSerializer

# NOT USED IN FRONT END DELETES SESSION USER SPOTIFY TOKEN IF REFRESH TOKEN IS REVOKED
class RevokeToken(APIView):
  def post(self, request, format=None):
    if self.request.session.session_key:
      user = self.request.session.session_key
      token_results = SpotifyToken.objects.filter(user=user)

      if len(token_results) > 0:
        token = token_results[0]
        token.delete()

      return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
# NOT USED IN FRONT END DELETES SESSION USER SPOTIFY TOKEN IF REFRESH TOKEN IS REVOKED

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

class ResetUsers(APIView):
  pass

class IsAuthenticated(APIView):
  def get(self, request, format=None):
    is_authenticated = is_spotify_authenticated(self.request.session.session_key)
    return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
  def get(self, requet, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)
    if room.exists():
      room = room[0]
    else:
      return Response({}, status=status.HTTP_404_NOT_FOUND)
    host = room.host
    endpoint = 'player/currently-playing'

    response = execute_spotify_request(host, endpoint)

    if 'error' in response or 'item' not in response:
      return Response({}, status=status.HTTP_204_NO_CONTENT)

    item = response.get('item')
    duration = item.get('duration_ms')
    progress = response.get('progress_ms')
    album_cover = item.get('album').get('images')[0].get('url')
    is_playing = response.get('is_playing')
    song_id = item.get('id')
    artist_str = ''

    for i, artist in enumerate(item.get('artists')):
      if i > 0:
        artist_str += ', '

      name = artist.get('name')
      artist_str += name

    votes = len(Votes.objects.filter(room=room, song_id=song_id))

    song = {
      'id': song_id,
      'title': item.get('name'),
      'artist': artist_str,
      'duration': duration,
      'time': progress,
      'image_url': album_cover,
      'is_playing': is_playing,
      'votes': votes,
      'votes_required': room.votes_to_skip,
    }
    self.update_room_song(room, song_id)

    return Response(song, status=status.HTTP_200_OK)

  def update_room_song(self, room, song_id):
    current_song = room.current_song

    if current_song != song_id:
      room.current_song = song_id
      room.save(update_fields=['current_song'])
      votes = Votes.objext.filter(room=room).delete()

class PauseSong(APIView):
  def put(self, request, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)[0]

    if self.request.session.session_key == room.host or room.guest_can_pause:
      pause_song(room.host)

      return Response({}, status=status.HTTP_204_NO_CONTENT)
    return Response({}, status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
  def put(self, request, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)[0]

    if self.request.session.session_key == room.host  or room.guest_can_pause:
      play_song(room.host)

      return Response({}, status=status.HTTP_204_NO_CONTENT)
    return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
  def post(self, request, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)[0]
    votes = Votes.objects.filter(room=room, song_id=room.current_song)
    votes_needed = room.votes_to_skip

    if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
      votes.delete()
      skip_song(room.host)
    else:
      vote = Votes(user=self.request.session.session_key, room=room, song_id=room.current_song)
      vote.save()

    return Response({}, status=status.HTTP_204_NO_CONTENT)
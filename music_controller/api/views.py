from django import http
from django.shortcuts import render
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework import generics, status # view and status codes
from rest_framework.views import APIView
from rest_framework.response import Response #custom responses
from .models import Room

# Create your views here.

class RoomView(generics.ListAPIView): # creates a layout for you also use CreateAPIView
  queryset = Room.objects.all()
  serializer_class = RoomSerializer

class CreateRoomView(APIView):
  serializer_class = CreateRoomSerializer

  def post(self, request, format=None):
    #checks users session info for user info instead of sending actual the user info from frontend to backend
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      guest_can_pause = serializer.data.get('guest_can_pause') #serializer is json obj
      votes_to_skip = serializer.data.get('votes_to_skip')
      host = self.request.session.session_key

      queryset = Room.objects.filter(host=host)
      if queryset.exists():
        room = queryset[0]
        room.guest_can_pause = guest_can_pause
        room.votes_to_skip = votes_to_skip
        room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
        self.request.session['room-code'] = room.code #shows the room (or last room) the user is/was in, in the current session

        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
      else:
        room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
        room.save()
        self.request.session['room-code'] = room.code #shows the room (or last room) the user is/was in, in the current session

        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED) #gives json format of room with serializer function

    return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class GetRoom(APIView):
  serializer_class = RoomSerializer
  lookup_url_kwargs = 'code' # variable holding the key name for the value you want to lookup

  def get(self, request, format=None):
    code = request.GET.get(self.lookup_url_kwargs)
    if code != None:
      room = Room.objects.filter(code=code)
      if len(room) > 0:
        data = RoomSerializer(room[0]).data
        data['is_host'] = self.request.session.session_key == room[0].host

        return Response(data, status=status.HTTP_200_OK)
      return Response({'Room Not Found': 'Invalid room code'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
  lookup_url_kwargs = 'code'

  def post(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

      # for post req you can use request.data
    code = request.data.get(self.lookup_url_kwargs)

    if code != None:
      room_results = Room.objects.filter(code=code)
      if len(room_results) > 0:
        room = room_results[0]
        self.request.session['room-code'] = code #shows the room (or last room) the user is/was in, in the current session

        return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
      return Response({'Bad Request': 'Invalid room code'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Bad Request': 'Could not find code key'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):

  def get(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

     # see of there is a roomcode the user is already logged when they go to homepage
    data = {
      'code': self.request.session.get('room_code'),
    }
    print('data =', data) # DELETE ME --------------------------------------

    return http.JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
  def post(self, request, format=None):
    print('running post') # DELETE ME --------------------------------------
    if 'room_code' in self.request.session:
      print('found room_code') # DELETE ME --------------------------------------
      self.request.session.pop('room_code')
      host_id = self.request.session.session_key
      room_results = Room.objects.filter(host=host_id)

      if len(room_results) > 0:
        print('running delete') # DELETE ME --------------------------------------
        room = room_results[0]
        room.delete()

    return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
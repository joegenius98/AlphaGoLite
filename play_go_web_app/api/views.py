from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    # retrieve votes_to_skip and guest_can_pause from JavaScript --> Python vars.
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # establish session key
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # retrieve the data and convert from JS --> Python
        serializer = self.serializer_class(data=request.data)

        # if the data inputted is valid (e.g. we have a real number for votes_to_skip)
        if serializer.is_valid():
            # retrieve the data from serializer
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            # retrieve session key
            host = self.request.session.session_key
            # retrieve the unique room from unique session key
            queryset = Room.objects.filter(host=host)
            # if a room by the same user had already been created
            if queryset.exists():
                # simply update the current room's settings instead
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                # otherwise, create a new room
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                # save to SQLite database
                room.save()
                # save room code so that when a user exits and comes back, user can come back to the same room
                self.request.session['room_code'] = room.code
                # return Response --> CreateRoomPage.js's fetch method (reponse) => response.json
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        # return Response --> CreateRoomPage.js's fetch method (reponse) => response.json
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

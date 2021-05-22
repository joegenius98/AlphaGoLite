from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    """
    Information to get from a room:
        -specatators
            -Names
            -Colors
        -player 1/AI?
        -player 2/AI?
    """
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
    """    
    Redirect Spectators
    if they want to join a room
    """
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


class UpdateRoom(APIView):

    serializer_class = UpdateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # take in data from JavaScript request --> Python-readable
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # retrieve data from serializer
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)

            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            player1 = serializer.data.get('player1')
            player2 = serializer.data.get('player2')

            turn = serializer.data.get('turn')

            player1Color = serializer.data.get('player1Color')
            player2Color = serializer.data.get('player2Color')

            num_spectators = serializer.data.get('num_spectators')
            board = serializer.data.get('board')
            spectatorArray = serializer.data.get('spectatorArray')

            room = queryset[0]
            # # save room code so that when a user exits and comes back, user can come back to the same room
            # self.request.session['room_code'] = room.code
            room.player1 = player1

            room.player2 = player2

            room.turn = turn
            room.player1Color = player1Color
            room.player2Color = player2Color

            room.num_spectators = num_spectators
            room.board = board
            room.spectatorArray = spectatorArray
            room.save(update_fields=["board", "turn"
                                     "player1Color", "player2Color", "player1", "player2", "spectatorArray", "num_spectators"])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        # return Response --> CreateRoomPage.js's fetch method (reponse) => response.json
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'Message': 'Success', "room": str(room_results)}, status=status.HTTP_200_OK)


class CreateRoomView(APIView):
    # convert JavaScript vars. to Python vars.

    # fields = ('turn', 'board')
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # establish session key if needed
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # take in data from JavaScript request --> Python-readable
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # retrieve data from serializer
            turn = serializer.data.get('turn')
            board = serializer.data.get('board')

            # # retrieve session key
            host = self.request.session.session_key
            # retrieve unique room from unique session key
            queryset = Room.objects.filter(host=host)

            # if this user has already created a room
            if queryset.exists():
                # simply update this room's settings
                room = queryset[0]
                # save room code so that when a user exits and comes back, user can come back to the same room
                self.request.session['room_code'] = room.code
                room.turn = turn
                room.board = board
                room.save(update_fields=["board", "turn"])
                # return Response --> CreateRoomPage.js's fetch method (reponse) => response.json
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:  # otherwise, create a new room
                room = Room(host=host, turn=turn, board=board)
                room.save()  # save to the SQLite database
                # save room code so that when a user exits and comes back, user can come back to the same room
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        # return Response --> CreateRoomPage.js's fetch method (reponse) => response.json
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

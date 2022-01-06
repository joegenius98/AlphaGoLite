from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
import random
import logging
logger = logging.getLogger(__name__)

# Create your views here.


class RoomView(generics.ListAPIView):
    """RoomView is for debugging purposes (to make sure room data is all correct)"""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    """
    CreateRoomView takes in a user request and data (whether to include AI whether player 1/the room creator goes first)
    If player 1 selected black --> goes first, so player 1's turn value = True. Otherwise, player1_turn = False.
    """
    # this serializer helps convert JavaScript vars. to Python vars.
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # establish session key if needed
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # take in data from JavaScript request --> Python-readable
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # retrieve data from serializer
            p1_turn = serializer.data.get('player1_turn')  # nopep8
            logger.error(f"This is player 1 turn value: {p1_turn}")

            AI = serializer.data.get('AI')

            # # retrieve session key
            host = self.request.session.session_key
            # retrieve unique room from unique session key
            queryset = Room.objects.filter(host=host)

            # if this user has already created a room
            # TODO: warn the user that he/she/whatever pronoun has an active game already
            # and send the user to the already-active room
            if queryset.exists():
                # simply update this room's settings
                room = queryset[0]
                # save room code so that when a user exits and comes back, user can come back to the same room
                self.request.session['room_code'] = room.code
                # room.turn = turn
                # room.AI = AI
                # # room.board = board
                # room.save(update_fields=["turn", "AI"])
                # return Response --> CreateRoomPage.js's fetch method (reponse) => response.json
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:  # otherwise, create a new room
                room = Room(host=host, curr_turn=True, AI=AI,
                            player1_turn=p1_turn, player2_turn=not p1_turn)
                room.save()  # save to the SQLite database
                # save room code so that when a user exits and comes back, user can come back to the same room
                self.request.session['room_code'] = room.code

                logger.error(f"Is player 1 first? : {room.player1_turn}")  # nopep8
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        # return Response --> CreateRoomPage.js's fetch method (reponse) => response.json
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {'code': self.request.session.get('room_code')}
        return JsonResponse(data, status=status.HTTP_200_OK)


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
                if room[0].AI:
                    room[0].player2 = "Cyborg Tuna 10"
                data = RoomSerializer(room[0]).data

                # if the room creator was previously in room, we add "TMP"
                # so that the frontend think that that person is still player 1
                if self.request.session.session_key == room[0].host:
                    data['is_host'] = True
                    data["player1"] = "TMP" + \
                        data["player1"] if "TMP" != data["player1"][:3] else data["player1"]
                else:
                    data['is_host'] = False
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    """
    Redirect spectators or player 2 if they want to join a room
    """
    lookup_JSON_key = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_JSON_key)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class LeaveRoom(APIView):
    """Deletes the room from the database when either player decides to leave"""

    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'Message': 'Success', "room": str(room_results)}, status=status.HTTP_200_OK)

from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'player1', 'player2', 'player1Color', 'player2Color'
                  'num_spectators', 'turn', 'created_at', "board", "spectatorArray")


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('turn', 'board')

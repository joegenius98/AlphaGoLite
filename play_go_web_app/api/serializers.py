from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'player1', 'player2', 'player1Color', 'player2Color',
                  'num_spectators', 'turn', 'host', 'created_at', "board", 'is_human_player_first', "spectatorArray", "AI")


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('is_human_player_first', 'AI')


class UpdateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('code', 'player1', 'player2', 'turn', 'player1Color', 'player2Color',
                  'num_spectators', 'board', 'spectatorArray', 'AI')

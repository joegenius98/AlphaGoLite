from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'player1', 'player2', 'player1_color', 'player2_color',
                  'num_spectators', 'curr_turn', 'host','host1', 'created_at', "board", 'player1_turn', 'player2_turn', "spectator_list", "AI")


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('player1_turn', 'AI')


# class UpdateRoomSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Room
#         fields = ('code', 'player1', 'player2', 'curr_turn', 'player1_color', 'player2_color',
#                   'num_spectators', 'board', 'spectator_list', 'AI')

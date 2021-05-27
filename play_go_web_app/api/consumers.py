# chat/consumers.py
from cmath import log
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Room
import logging
logger = logging.getLogger(__name__)


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['uri']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        logger.error(str(text_data_json))
        player1 = text_data_json['player1']
        player2 = text_data_json['player2']

        player1Color = text_data_json['player1Color']

        player2Color = text_data_json['player2Color']
        turn = True if text_data_json['turn'] == "True" else False
        new_move_x = int(text_data_json['new_move_x'])
        new_move_y = int(text_data_json['new_move_y'])

        code = self.room_name
        queryset = Room.objects.filter(code=code)
        room = queryset[0]
        room.player1 = player1

        room.player2 = player2

        room.turn = turn
        room.player1Color = player1Color
        room.player2Color = player2Color

        # We set the coordinates to -1
        # when we first join the room,
        # but we want to change the name
        # without making a move
        if new_move_x != -1:
            replace_idx = 19 * new_move_y + new_move_x
            room.board = room.board[:replace_idx] + \
                "1" + room.board[replace_idx+1:]

        room.save(update_fields=["board", "turn",
                                 "player1Color", "player2Color",
                                 "player1", "player2"])
    # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'room_details',
                'player1': room.player1,
                'player2': room.player2,
                'player1Color': room.player1Color,
                'player2Color': room.player2Color,
                'turn': room.turn,
                'board': room.board,
                'new_move_x': new_move_x,
                'new_move_y': new_move_y
            }
        )

    # Receive message from room group
    def room_details(self, event):
        player1 = event['player1']
        player2 = event['player2']
        player1Color = event['player1Color']
        player2Color = event['player2Color']
        turn = event['turn']

        board = event['board']
        new_move_x = event['new_move_x']
        new_move_y = event['new_move_y']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'player1': player1,
            'player2': player2,
            'player1Color': player1Color,
            'player2Color': player2Color,
            'turn': turn,
            'board': board,
            'new_move_x': new_move_x,
            'new_move_y': new_move_y
        }))

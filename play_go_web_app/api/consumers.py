# chat/consumers.py
from cmath import log
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Room
import logging
import random
logger = logging.getLogger(__name__)


class ChatConsumer(WebsocketConsumer):
    '''
    Room group is defined as the players in the Go match and the spectators. 
    This module handles incoming data sent by the client front-end (e.g., a new move played or a new text in the chat)
    and ensures that the data is broadcasted to the room group.
    '''

    def connect(self):
        # 'url_route' -> /ws/rooms/<uri> from routing.py; <uri> is the room code
        self.room_name = self.scope['url_route']['kwargs']['uri']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(self.room_group_name,
                                                    self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name,
                                                        self.channel_name)

    # Receive message from WebSocket and determine if A.I. needs to make a move
    def receive(self, text_data):
        to_send = {'type': 'room_details'}

        code = self.room_name
        queryset = Room.objects.filter(code=code)
        room = queryset[0]

        text_data_json = json.loads(text_data)
        logger.error(str(text_data_json))

        if 'player1' in text_data_json:
            player1 = text_data_json['player1']
            room.player1 = player1
            to_send['player1'] = player1

        if 'player2' in text_data_json:
            player2 = text_data_json['player2']
            room.player2 = player2
            to_send['player2'] = player2

        if 'player1Color' in text_data_json:
            player1Color = text_data_json['player1Color']
            room.player1Color = player1Color
            to_send['player1Color'] = player1Color

        if 'player2Color' in text_data_json:
            player2Color = text_data_json['player2Color']
            room.player2Color = player2Color
            to_send['player2Color'] = player2Color

        if 'board' in text_data_json:
            board = text_data_json['board']
            room.board = board
            to_send['board'] = board

            if 'turn' in text_data_json:
                turn = text_data_json['turn']
                room.turn = turn
                to_send['turn'] = turn

                if 'isHumanPlayerFirst' in text_data_json:
                    is_human_player_first = text_data_json['isHumanPlayerFirst']

                    # if it's the A.I.'s turn
                    if turn != is_human_player_first:
                        self.random_move(
                            "2" if is_human_player_first else "1", room)
                        # since a new move = updated board
                        to_send['board'] = room.board
                        # we switch it over to the human player
                        to_send['turn'] = not turn

        room.save(update_fields=["board", "turn",
                                 "player1Color", "player2Color",
                                 "player1", "player2"])
        # Send message to room group
        # nopep8
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, to_send)

        # # AI case: B if AI move should be black and W if AI move should be white
        # AI = False
        # ai_is_black = None

        # if turn[-1] == "B":
        #     AI = True
        #     ai_is_black = True
        #     turn = turn[:-1]
        # elif turn[-1] == "W":
        #     AI = True
        #     ai_is_black = False
        #     turn = turn[:-1]

        # accounts for all possible spellings just in case
        # if str(turn) in {"false", "False", "FALSE"}:
        #     turn = False
        # else:
        #     logger.error(str(text_data_json))
        #     turn = True

        # if 'asdfasdf' not in text_data_json:
        #     print('woo we mama this works! Woo-hoo!')

        # if AI:
        #     turn = not turn
        # new_move_x = int(text_data_json['new_move_x'])
        # new_move_y = int(text_data_json['new_move_y'])

        # # We set the coordinates to -1
        # # when we first join the room,
        # # but we want to change the name
        # # without making a move
        # if new_move_x != -1:
        #     # logic: after clicking, it is immediately the other player's turn. So, when player 1 clicks for a move, for example,
        #     # it is immediately player 2's turn, which means that player 1 has just made a move. That's why if it's player 1's turn (where turn == True),
        #     # player 2 just went, and thus we make board_piece_str "2".
        #     board_piece_str = "2" if turn else "1"
        #     replace_idx = 19 * new_move_y + new_move_x
        #     room.board = room.board[:replace_idx] + \
        #         board_piece_str + room.board[replace_idx+1:]

        # Originally we had that new move (x, y) idea for the minimization of data sent, but realized that when captures occur in Go,
        # we would somehow need to reflect that change in the backend board. Since godash takes cares of data structures and algorithms for Go board,
        # we scraped the new_move_x and new_move_y idea and just send in the whole board string representation from the frontend.

        # if AI:
        #     self.random_move(ai_is_black, room)

        # {
        #     'type': 'room_details',
        #     'player1': room.player1,
        #     'player2': room.player2,
        #     'player1Color': room.player1Color,
        #     'player2Color': room.player2Color,
        #     'turn': room.turn,
        #     'board': room.board,
        #     # 'new_move_x': new_move_x,
        #     # 'new_move_y': new_move_y
        # }
        # )

    def random_move(self, board_piece_str, room):
        # Random Move.
        # board_piece_str = "2" if not black_is_ai else "1"
        random_open_coordinates = []
        for i in range(len(room.board)):
            if room.board[i] not in {"2", "1"}:
                x = i % 19
                y = (i-x)//19
                random_open_coordinates.append((x, y, i))
        # chose random coordinate from a list of random coordinatesmove = random.choice(random_open_coordinates)
        _, __, index = random.choice(random_open_coordinates)
        room.board = room.board[:index] + \
            board_piece_str + room.board[index+1:]

        # decided that new_move_x and new_move_y won't be communicated in socket sending, because we are simply
        # sending in and out the updated board string representation.The board can change drastically with captured stones; you
        # should not assume all it takes to update a client's board is the addition of a new piece on the board, when that addition
        # can have the consequence of deleting other pieces on the board.
        # return new_move_x, new_move_y

    # Receive message from room group

    def room_details(self, event):
        self.send(text_data=json.dumps(event))
        # player1 = event['player1']
        # player2 = event['player2']
        # player1Color = event['player1Color']
        # player2Color = event['player2Color']
        # turn = event['turn']

        # board = event['board']
        # # new_move_x = event['new_move_x']
        # # new_move_y = event['new_move_y']

        # # Send message to WebSocket
        # self.send(text_data=json.dumps({
        #     'player1': player1,
        #     'player2': player2,
        #     'player1Color': player1Color,
        #     'player2Color': player2Color,
        #     'turn': turn,
        #     'board': board,
        #     # 'new_move_x': new_move_x,
        #     # 'new_move_y': new_move_y
        # }))

from django.db import models
import string
import random


def generate_unique_code():
    length = 6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break
    return code


def pickRandomColor():
    return random.choice(["#4791db", "#e33371", "#81c784", "#e57373", "#ffb74d", "#64b5f6"])


def randomNameP2():
    return 'TMP'+'Anonymous ' + random.choice(["Deliverer", "Tank", "Koichi",
                                               "Groundhog", "Armor", "Baller",
                                               "Collector", "Pencil", "Water", "Symmetry"]) + random.choice([str(x) for x in range(100)])


def randomNameP1():
    return 'TMP'+'Anonymous ' + random.choice(["Duck", "Tuna", "Koala",
                                               "Giraffe", "Armadillo", "Bear",
                                               "Cheetah", "Penguin", "Whale", "Serpent"]) + random.choice([str(x) for x in range(100)])


class Room(models.Model):
    code = models.CharField(
        max_length=8, default=generate_unique_code)
        
    #session key for player 1
    host = models.CharField(max_length=50, unique=True)

    #session key for player 2
    host1 = models.CharField(max_length=50, unique=False, default='NONE')

    # user names of the players, initalized with "TMP"
    player1 = models.CharField(
        default=randomNameP1, max_length=50)
    player2 = models.CharField(
        default=randomNameP2, max_length=50)

    # stored as hex codes
    player1_color = models.CharField(max_length=7, default=pickRandomColor)
    player2_color = models.CharField(max_length=7, default=pickRandomColor)

    # store the number of people in a room
    num_spectators = models.IntegerField(default=0, null=False)

    # this value is True at start of game and switches for every person's turn
    # we determine who goes first by comparing this value with the turn
    # booleans for player 1 and player 2
    curr_turn = models.BooleanField(null=False, default=True)
    # True <--> black piece, False <--> white piece, since black always goes first before white does
    # By default, player 1 (the person creating the game) chooses black and therefore has a turn value of true.
    # If player 1 chooses white instead, then player 2 goes first since player 2 is black.
    player1_turn = models.BooleanField(null=False, default=True)
    player2_turn = models.BooleanField(null=False, default=False)

    # whether the human player is facing an A.I.
    AI = models.BooleanField(null=False, default=False)

    # # self-explanatory (whether or not there is an A.I. -- helps with determining turn)
    # is_human_player_first = models.BooleanField(null=False, default=False)

    # when the room/model was created
    created_at = models.DateTimeField(auto_now_add=True)

    # state i.e. 19x19 length string of 0s to represent empty board
    # we must use a charfield which then must be converted
    # from JavaScript String -> Python list for backend A.I. input
    # and then,
    # from Python string -> JavaScript string for frontend

    # "1" --> black piece and "2" --> white piece
    board = models.CharField(
        max_length=765, unique=False, default="0" * 19 * 19)

    # spectators
    spectator_list = models.CharField(
        max_length=275, unique=False, default="[]")
    """
    Home Page
       /  \
    Room   Create Room Page
    Join            |
    Page           /
        \         / 
          \      /
            Room ---------------Direct link to Room
        Objects     
            Board=[]
            Turn?
            Player1/AI? and color
            Player2/AI? and color
            Spectators=[]  
    """

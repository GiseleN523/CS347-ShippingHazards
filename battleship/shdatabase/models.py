from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    is_ai_player = models.BooleanField(default=False)
    screen_name = models.CharField(max_length=100)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    num_of_ships_sunk= models.IntegerField(default=0)
    color_preference = models.CharField(max_length=50, default='ff8ac7', null=True)

    def __str__(self):
        return self.screen_name

class Game(models.Model):
    is_ai_game = models.BooleanField(default=True)
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_games')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_games') 
    player1_ship_status = models.IntegerField(default=0) #0 if ships not confirmed, 1 if confirmed
    player2_ship_status = models.IntegerField(default=0) #0 if ships not confirmed, 1 if confirmed
    board1ID = models.IntegerField(default=0)
    board2ID = models.IntegerField(default=0)
    turn = models.IntegerField(default=0) #1 for player 1's turn, 2 for player 2's turn
    status = models.IntegerField(default=0) #0 for in progress, 1 for player1 won, 2 for player2 won
    num_ships = models.IntegerField(default=4)
    winner = models.IntegerField(default=0)
    loser = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id)

class Board(models.Model):
    size = models.IntegerField(default=10)
    ship_board = models.CharField(max_length=200) #string representing ship placement
    attack_board = models.CharField(max_length=200) #string representing attack locations
    combined_board = models.CharField(max_length=200)
    '''
    The default negative values for is_hit, shot_row, and shot_col represent that a shot has not 
    been made yet. Once a shot is made, they become nonnegative
    '''
    is_hit = models.IntegerField(default=-1)
    is_sunk = models.IntegerField(default=-1)
    shot_row = models.IntegerField(default=-1)
    shot_col = models.IntegerField(default=-1) 

    def __str__(self):
        return str(self.id)
    
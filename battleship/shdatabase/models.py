from django.db import models


class Player(models.Model):
    is_ai_player = models.BooleanField(default=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    screen_name = models.CharField(max_length=100)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    num_of_ships_sunk= models.IntegerField(default=0)

    def __str__(self):
        return self.username

class Game(models.Model):
    is_ai_game = models.BooleanField(default=True)
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_games')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_games') #Unsure how we will want to set on_delete but 
    board1ID = models.IntegerField(default=0)
    board2ID = models.IntegerField(default=0)
    turn = models.IntegerField(default=0) #1 for player 1's turn, 2 for player 2's turn
    status = models.IntegerField(default=0) #0 for in progress, 1 for player1 won, 2 for player2 won
    num_ships = models.IntegerField(default=0)
    winner = models.IntegerField(default=0)
    loser = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id)

class Board(models.Model):
    size = models.IntegerField(default=10)
    ship_board = models.CharField(max_length=200) #string representing ship placement
    attack_board = models.CharField(max_length=200) #string representing attack locations
    combined_board = models.CharField(max_length=200)

    def __str__(self):
        return str(self.id)
    
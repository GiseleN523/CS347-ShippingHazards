from django.db import models


# Create your models here.
class Player(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    screen_name = models.CharField(max_length=100)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    num_of_ships_sunk= models.IntegerField(default=0)

    def __str__(self):
        return self.username

class Game(models.Model):
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_games')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_games') #Unsure how we will want to set on_delete but 
    board1 = models.IntegerField(default=0)
    board2 = models.IntegerField(default=0)
    turn = models.IntegerField(default=0) #1 for player 1's turn, 2 for player 2's turn
    status = models.IntegerField(default=0) #0 for not started, 1 for in progress, 2 for complete?
    num_ships = models.IntegerField(default=0)
    winner = models.IntegerField(default=0)
    loser = models.IntegerField(default=0)

    def __str__(self):
        return self.id

class Board(models.Model):
    ship_board = models.CharField(max_length=200)
    attack_board = models.CharField(max_length=200)
    combined_board = models.CharField(max_length=200)

    def __str__(self):
        return self.id
    
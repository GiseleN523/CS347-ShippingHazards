from django.db import models


# Create your models here.
class Player(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    screen_name = models.CharField(max_length=100)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    num_of_ships_sunk= models.IntegerField(default=0)

class Game(models.Model):
    player1_id = models.ForeignKey(Player, on_delete=models.CASCADE) #Many to One relationship from Games to player.
    player2_id = models.ForeignKey(Player, on_delete=models.CASCADE) #Unsure how we will want to set on_delete but 
    board1_id = models.IntegerField(default=0)
    board2_id = models.IntegerField(default=0)
    turn = models.IntegerField(default=0) #1 for player 1's turn, 2 for player 2's turn
    status = models.IntegerField(default=0) #0 for not started, 1 for in progress, 2 for complete?
    num_ships = models.IntegerField(default=0)
    winner_id = models.IntegerField(default=0)
    loser_id = models.IntegerField(default=0)

class Board(models.Model):
    ship_board = models.CharField(max_length=200)
    attack_board = models.CharField(max_length=200)
    combined_board = models.CharField(max_length=200)
    
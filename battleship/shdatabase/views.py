from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Player, Game, Board
from rest_framework import permissions, viewsets
import random

from .serializers import PlayerSerializer, GameSerializer, BoardSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = [permissions.IsAuthenticated]

class GameViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows games to be viewed or edited.
    """
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

class BoardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows boards to be viewed or edited.
    """
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

def new_board():
    """
    Creates a new Board object and returns its ID.
    """
    board = Board()
    board.save()
    return board.id

def new_game(request, player1_id, player2_id, num_ships):
    """
    API endpoint that creates a new Game object and returns its ID.
    """
    game = Game()
    game.player1_id = player1_id
    game.player2_id = player2_id
    game.board1 = new_board()
    game.board2 = new_board()
    game.turn = random.randint(1, 2)
    game.status = 0
    game.num_ships = num_ships
    game.winner = 0 
    game.loser = 0
    game.save()
    return JsonResponse({"game_id": game.id})

def get_player_board(game, player_id): 
    """
    Returns the Board object corresponding to a specified player in a specified game.
    """
    if (game.player1_id == player_id):
            board1_object = Board.objects.get(id = game.board1)
            return board1_object
    elif (game.player2_id == player_id):
            board2_object = Board.objects.get(id = game.board2)
            return board2_object
    else:
        raise ValueError("Game ID does not correspond to Player ID")

def confirm_ships(request, game_id, player_id, ship_board):
    """
    API endpoint that saves a player's ship_board and returns it.
    """
    game = Game.objects.get(id = game_id)
    board = get_player_board(game, player_id)
    board.ship_board = ship_board
    board.save()
    return JsonResponse({"ship_board": board.ship_board})
       
def get_opponent(game, player_id):
    """
    Returns the opponent's ID given a specified player and game.
    """
    if (game.player1_id == player_id):
            return game.player2_id
    elif (game.player2_id == player_id):
            return game.player1_id
    else:
        raise ValueError("Game ID does not correspond to Player ID")     

def get_state(request, game_id, player_id, is_my_board):
    """
    API endpoint that returns board state(s).

    is_my_board represents whether the requested board belongs to the player making the request.
    If is_my_board is true, returns the player's attack_board and ship_board.
    If is_my_board is false, returns the opponent's attack_board.
    """
    game = Game.objects.get(id = game_id) 
    if (is_my_board == "true"):
        board = get_player_board(game, player_id)
        return JsonResponse({"attack_board": board.attack_board,
                             "ship_board": board.ship_board})
    elif (is_my_board == "false"):
        opponent_id = get_opponent(game, player_id)
        board = get_player_board(game, opponent_id)
        return JsonResponse({"attack_board": board.attack_board})                
    else:
        raise ValueError("is_my_board must be 'true' or 'false'")

# IN PROGRESS - WILL BE COMPLETED BY WEDNESDAY EVENING
def fire_shot(request, game_id, player_id, attack_board, row, col):
    """
    API endpoint that returns hit status after shot is fired.
    """
    is_hit = 0 #thoughts on True/False vs 'true/false' vs 0/1 ?
    return JsonResponse({"is_hit": is_hit})


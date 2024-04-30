from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Player, Game, Board
from rest_framework import permissions, viewsets
import random

from .serializers import PlayerSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = [permissions.IsAuthenticated]

def new_board():
    board = Board()
    board.save()
    return board.id

def new_game(request, player1id, player2id, num_ships):
    game = Game()
    game.player1_id = player1id
    game.player2_id = player2id
    game.board1 = new_board()
    game.board2 = new_board()
    game.turn = random.randint(1, 2)
    game.status = 0
    game.num_ships = num_ships
    game.winner = 0 
    game.loser = 0
    game.save()
    return JsonResponse({"game_id": game.id})


from .models import Player, Game, Board
from rest_framework import serializers


class PlayerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'screen_name','wins', 'losses', 'num_of_ships_sunk']

class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['player1', 'player2', 'board1', 'board2','turn','status','num_ships','winner','loser']


class BoardSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['ship_board', 'attack_board', 'combined_board']

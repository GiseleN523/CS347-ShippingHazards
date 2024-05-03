from .models import Player, Game, Board
from rest_framework import serializers


class PlayerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Player
        fields = ['is_ai_player', 'username', 'screen_name','wins', 'losses', 'num_of_ships_sunk']

class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['is_ai_game', 'player1', 'player2', 'board1ID', 'board2ID','turn','status',
                  'num_ships','winner','loser']


class BoardSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['size', 'ship_board', 'attack_board', 'combined_board', 'is_hit', 'shot_row', 'shot_col']

from django.contrib import admin
from .models import Player, Game, Board

class PlayerAdmin(admin.ModelAdmin):
    list_display = ('username', 'screen_name', 'wins', 'losses', 'num_of_ships_sunk')
    search_fields = ('username', 'screen_name')
    list_filter = ('wins', 'losses', 'num_of_ships_sunk')

class GameAdmin(admin.ModelAdmin):
    list_display = ('player1', 'player2', 'turn', 'status', 'num_ships', 'winner', 'loser')
    list_filter = ('turn', 'status')
    search_fields = ('player1__username', 'player2__username')  # You can search by related fields

class BoardAdmin(admin.ModelAdmin):
    list_display = ( 'ship_board', 'attack_board', 'combined_board')

admin.site.register(Player, PlayerAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(Board, BoardAdmin)

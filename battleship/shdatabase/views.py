from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Player, Game, Board
from rest_framework import permissions, viewsets
import requests

from .serializers import PlayerSerializer, GameSerializer, BoardSerializer
from django.contrib.auth.forms import AuthenticationForm

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

def room(request, room_name):
    return render(request, "shdatabase/room.html", {"room_name": room_name})

def new_board(board_size):
    """
    Creates a new Board object and returns its ID.
    """
    board = Board()
    board.size = board_size
    board.ship_board = "-"*100
    board.attack_board = "-"*100
    board.combined_board = "-"*100
    '''
    The default negative values for is_hit, shot_row, and shot_col represent that a shot has not 
    been made yet. Once a shot is made, they become nonnegative
    '''
    board.is_hit = -1
    board.shot_row = -1
    board.shot_col = -1
    board.is_sunk = -1
    board.save()
    return board.id

def new_game(request, player1_id, player2_id, num_ships, board_size, is_ai_game):
    """
    API endpoint that creates a new Game object and returns its ID.
    """
    game = Game()
    if is_ai_game == "true":
        game.is_ai_game = True
    elif is_ai_game == "false":
        game.is_ai_game = False              
    else:
        raise ValueError("is_ai_game must be 'true' or 'false'")
    
    game.player1_id = player1_id
    game.player2_id = player2_id
    game.board1ID = new_board(board_size)
    game.board2ID = new_board(board_size)
    game.turn = 1
    game.status = 0
    game.num_ships = num_ships
    game.winner = 0 
    game.loser = 0
    game.save()
    
    requests.get('http://ai-server:5555/new-game/' + str(player1_id) + '/' + str(player2_id)  + '/' + str(num_ships) + '/' + str(board_size) + '/' + str(game.id))


    return JsonResponse({"game_id": game.id})

def get_player_board(game, player_id): 
    """
    Returns the Board object corresponding to a specified player in a specified game.
    """
    if game.player1_id == player_id:
            board1 = Board.objects.get(id = game.board1ID)
            return board1
    elif game.player2_id == player_id:
            board2 = Board.objects.get(id = game.board2ID)
            return board2
    else:
        raise ValueError("Game ID does not correspond to Player ID")

def confirm_ships(request, game_id, player_id, ship_board):
    """
    API endpoint that saves a player's ship_board and returns it.
    """
    game = Game.objects.get(id = game_id)
    board = get_player_board(game, player_id)
    board.ship_board = ship_board
    board.combined_board = ship_board
    board.save()
    return JsonResponse({"ship_board": board.ship_board})
       
def get_opponent(game, player_id):
    """
    Returns the opponent's ID given a specified player and game.
    """
    if game.player1_id == player_id:
            return game.player2_id
    elif game.player2_id == player_id:
            return game.player1_id
    else:
        raise ValueError("Game ID does not correspond to Player ID")     

def get_state(request, game_id, player_id, is_my_board):
    """
    API endpoint that returns board and game states.
    """
    game = Game.objects.get(id = game_id) 
    if is_my_board == "true":
        board = get_player_board(game, player_id)
        return JsonResponse({"ship_board": board.ship_board,
                            "attack_board": board.attack_board,
                            "is_hit": board.is_hit,
                            "is_sunk": board.is_sunk,
                            "shot_row": board.shot_row,
                            "shot_col": board.shot_col,
                            "turn": game.turn,
                            "status": game.status})
    
    elif is_my_board == "false":
        opponent_id = get_opponent(game, player_id)
        board = get_player_board(game, opponent_id)
        return JsonResponse({"attack_board": board.attack_board,
                            "is_hit": board.is_hit,
                            "is_sunk": board.is_sunk,
                            "shot_row": board.shot_row,
                            "shot_col": board.shot_col,
                            "turn": game.turn,
                            "status": game.status}) 
                   
    else:
        raise ValueError("is_my_board must be 'true' or 'false'")

def is_player_turn(game, player_id):
    """
    Returns True if it's the specified player's turn in the specified game
    Otherwise, returns False
    """   
    if ((game.player1_id == player_id and game.turn == 1) or 
        (game.player2_id == player_id and game.turn == 2)):
        return True
    
    elif ((game.player1_id == player_id and game.turn == 2) or 
          (game.player2_id == player_id and game.turn == 1)):
        return False
    
    else:
        raise ValueError("Game ID does not correspond to Player ID")
    
def fire_shot(request, game_id, player_id, row, col):
    """
    API endpoint that returns hit status, attack board, turn, and game status after player fires shot.
    """
    game = Game.objects.get(id = game_id)
    if is_player_turn(game, player_id):
        opponent_id = get_opponent(game, player_id)
        board = get_player_board(game, opponent_id) 

        #updates and saves attack board, combined board, shot row, and shot col
        combinedBoard, attackBoard = updateBoards(board.ship_board, board.combined_board, 
                                                  board.attack_board, row, col)
        board.attack_board = attackBoard
        board.combined_board = combinedBoard
        board.shot_row = row
        board.shot_col = col
        board.save()

        hit_status, ship_char = isHit(board.ship_board, row, col)
        if hit_status == True:
            board.is_hit = 1 
            board.save()

            #if the hit sunk a ship, updates the board info and player's profile stats
            if isShipSunk(combinedBoard, ship_char):
                board.is_sunk = 1
                board.save()
                player = Player.objects.get(id = player_id) 
                player.num_of_ships_sunk += 1
                player.save()  

                #if hit made the player win the game, updates information about game, player, and opponent
                if isWinner(combinedBoard):
                    game.status = game.turn
                    game.winner = player_id
                    game.loser = opponent_id
                    game.save()

                    winning_player = Player.objects.get(id = player_id)
                    winning_player.wins += 1
                    winning_player.save()

                    losing_player = Player.objects.get(id = opponent_id)
                    losing_player.losses += 1
                    losing_player.save()  
            else:
                board.is_sunk = 0
                board.save()
                              
        else:
            #if the player missed their shot, updates and saves hit, sink, and turn
            board.is_hit = 0
            board.is_sunk = 0
            board.save()
            if game.turn == 1:
                game.turn = 2
                game.save()
            elif game.turn == 2:
                game.turn = 1
                game.save()
            else:
                raise ValueError("Turn must be 1 or 2")
            
        return JsonResponse({"attack_board": board.attack_board,
                            "is_hit": board.is_hit,
                            "is_sunk": board.is_sunk,
                            "turn": game.turn,
                            "status" : game.status})
    
    else:
        raise ValueError("Player cannot fire shot when it is not their turn")

def get_player_info(request, player_id):
    player = Player.objects.get(id = player_id) 
    return JsonResponse({"is_ai_player":player.is_ai_player,
                        "screen_name": player.screen_name,
                        "wins": player.wins,
                        "losses": player.losses,
                        "num_of_ships_sunk": player.num_of_ships_sunk})

'''
The following game logic code was written by Josh Meier and Willow Gu in logic.py.
The code was copied and pasted here because this backend code is currently in a separate branch.
Once backend code is in main, we will remove the copied code and import the game logic code.
'''

# func that gives the item at certain coordinates
def charAt(board, row, col): # from Matt Lepinski connect4-server.py
    '''
    Input: any 10x10 board, int row, int col
    Output: the character at the (row, col) of the 10x10 board
    '''
    index = col + row*10
    return board[index]

# helper func that updates the char at certain coords in the board-string to be the new char 
def updateChar(board, newChar, row, col):
    '''
    Input: any 10x10 board, the new character, and what row and col to be updated
    Output: the updated board 
    '''
    index = col + row*10
    # board[index] = newChar
    return board[:index] + newChar + board[index+1:]


# start game (gives blank boardstate) 
def blankBoard():
    return "-"*100

# checking if a player wins
def isWinner(combinedBoard):
    '''
    Input: combinedBoard that has ship chars and attacks (hits and misses)
    Output: True if the board has no ships left, False if the board has ships left 
    '''
    for row in range(10):
        for col in range(10):
            if charAt(combinedBoard, row, col) not in ("X", "O", "-"):
                return False
    return True

# Check if the most recent attack is a valid move?
def isValidAttack(attackBoard, attackRow, attackCol):
    '''
    Input: attackBoard with only previous hits and misses, row and col of next attack
    Output: True if there has not been an attack at those coordinates before, otherwise False
    '''
    if charAt(attackBoard, attackRow, attackCol) == "-":
        return True
    else:
        return False

# Check if the most recent attack a hit or not
def isHit(shipBoard, attackRow, attackCol):
    '''
    Input: shipBoard, row and col of next attack
    Output: Whether there is a ship at the coordinates of the attack (True or False), and the char at the location of the attack
    '''
    char = charAt(shipBoard, attackRow, attackCol)
    if char != "-":
        return True, char
    else:
        return False, char
    
# has a ship been sunk?
def isShipSunk(combinedBoard, ship):
    '''
    Input: combinedBoard and the char signifying a specific ship
    Output: True if all parts of that specific ship have been hit, False otherwise
    '''
    for row in range(10):
        for col in range(10):
            if charAt(combinedBoard, row, col) == ship:
                return False
    return True


# updating combinedBoard and attackBoard given the attack row and col
def updateBoards(shipBoard, prevCombinedBoard, prevAttackBoard, attackRow, attackCol):
    '''
    Input: all 3 board types, and the row and col of the next attack
    Output: the combinedBoard and attackBoard with the result of the attack incorporated into both
    '''
    hitStatus, char = isHit(shipBoard, attackRow, attackCol)
    if hitStatus:
        char = "X"
    else:
        char = "O"
    newCombinedBoard = updateChar(prevCombinedBoard, char, attackRow, attackCol)
    newAttackBoard = updateChar(prevAttackBoard, char, attackRow, attackCol)
    return newCombinedBoard, newAttackBoard


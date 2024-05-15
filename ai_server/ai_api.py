from flask import Flask
import requests
import threading
from ai_player.ai import BattleShipAI
import time

app = Flask(__name__)

ai_player_ids = {"1": "inOrder",
                "2": "random",
                "3": "targeted"}

# not sure if this route is right?? 
@app.route('/new-game/<player1_id>/<player2_id>/<num_ships>/<board_size>/<game_id>') 
def start_new_game(player1_id, player2_id, num_ships, board_size, game_id):
    ai_thread = threading.Thread(target=run_game, args=(player1_id, player2_id, num_ships, board_size, game_id))
    ai_thread.start()

    return ""

def run_game(player1_id, player2_id, num_ships, board_size, game_id):
    # setup the ships
    ship_board = "-a---------a--------------------cccc-----------d---------d---------d---------d------bbb-------------"
    # params = {'game_id': game_id,
    #           'player2_id': player2_id,
    #           'ship_board': ship_board}
    url = 'http://web:8000/play/confirm-ships/{}/{}/{}'.format(game_id, player2_id, ship_board)
    response = requests.get(url)
    # initialize the ai player
    ai = BattleShipAI()
    ai.attackBoard = "-"*100
    ai.type = ai_player_ids[player2_id]    # set its type to the corresponding player2_id
    
    # call get_state
    # params = {'game_id': game_id,
    #           'player2_id': player2_id}
    url = 'http://web:8000/play/get-state/{}/{}'.format(game_id, player1_id)
    response = requests.get(url)
    data = response.json()
    # save game_status, my_turn, and attack_board in vars
    ai.attackBoard = data["attack_board"] 
    my_turn = data["turn"]
    game_status = data["status"]

    # while the game isnt over (game_status == 0) 
    while game_status == 0:
        time.sleep(2)
        # params = {'game_id': game_id,
        #       'player2_id': player2_id}
        url = 'http://web:8000/play/get-state/{}/{}'.format(game_id, player1_id)
        response = requests.get(url)
        data = response.json()
        ai.attackBoard = data["attack_board"] 
        my_turn = data["turn"]
        game_status = data["status"]
        ai.previousShotHit = data["is_hit"]
        ai.previousShotRow = data["shot_row"]
        ai.previousShotCol = data["shot_col"]
        if my_turn == 2:
            row, col = ai.getMove()
            # params = {'game_id': game_id,
            #         'player2_id': player2_id,
            #         'row': row,
            #         'col': col}
            # do we need to sleep here??
            time.sleep(2)
            url = 'http://web:8000/play/fire-shot/{}/{}/{}/{}'.format(game_id, player2_id, row, col) 
            response = requests.get(url)
     
    return


if __name__ == '__main__':
    host = '0.0.0.0'
    port = 5555 
    app.run(host=host, port=port, debug=True)
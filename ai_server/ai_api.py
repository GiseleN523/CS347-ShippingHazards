from flask import Flask
import requests
import threading
from ai_player.ai import BattleShipAI
import time
# Now using this library:
#   https://websocket-client.readthedocs.io/en/latest/index.html
import websocket
import json
import sys
import random

app = Flask(__name__)

ai_player_ids = {"1": "inOrder",
                "2": "random",
                "3": "targeted"}

# not sure if this route is right?? 
@app.route('/new-game/<player1_id>/<player2_id>/<num_ships>/<board_size>/<game_id>') 
def start_new_game(player1_id, player2_id, num_ships, board_size, game_id):
    
    ai_thread = threading.Thread(target=start_ai, args=(player1_id, player2_id, num_ships, board_size, game_id))
    ai_thread.start()
    
    return ""

def update_ai(ai, inner_dict):
    ai.attackBoard = inner_dict["attack_board"] 
    ai.previousShotHit = inner_dict["is_hit"]
    ai.previousShotRow = inner_dict["shot_row"]
    ai.previousShotCol = inner_dict["shot_col"]
           

def start_ai(player1_id, player2_id, num_ships, board_size, game_id):
   

    def on_message(ws, message):
        sys.stderr.write("AI Received: " + message + "/n")
        message_dict = json.loads(message)
        inner_dict = json.loads(message_dict['message'])
        
        game_status = inner_dict["status"]
        if game_status == 0: # while the game is not over (I think its an if and not a while now)
            
            update_ai(ai, inner_dict)

            if (inner_dict['turn'] == 2):
                # row = random.randint(0,6) ### for testing purposes
                # col = random.randint(0,6)

                row, col = ai.getMove()
                url = 'http://web:8000/play/fire-shot/{}/{}/{}/{}'.format(game_id, player2_id, row, col)
                response = requests.get(url)

    def on_open(ws):
        # ai "selects" its ship placement (will eventually have shipBoard be different every time)
        ship_board = "-a---------a--------------------cccc-----------d---------d---------d---------d------bbb-------------"
        url = 'http://web:8000/play/confirm-ships/{}/{}/{}'.format(game_id, player2_id, ship_board)
        response = requests.get(url)

    ###############################
    #BODY of start_ai function
    ws_url = "ws://web:8000/ws/play/{}/".format(game_id) 
    wsapp = websocket.WebSocketApp(ws_url, on_message=on_message, on_open=on_open)
    wsapp.run_forever()

     # initialize ai outside of ws functions so the ai object can be accessed 
    ai = BattleShipAI()
    ai.attackBoard = "-"*100
    ai.type = ai_player_ids[player2_id]
    ###############################

             
    


if __name__ == '__main__':
    host = '0.0.0.0'
    port = 5555 
    app.run(host=host, port=port, debug=True)

from flask import Flask
import requests
import threading
from ai_player.ai import BattleShipAI
import time
import websockets
import asyncio
import sys

app = Flask(__name__)

ai_player_ids = {"1": "inOrder",
                "2": "random",
                "3": "targeted"}

# not sure if this route is right?? 
@app.route('/new-game/<player1_id>/<player2_id>/<num_ships>/<board_size>/<game_id>') 
def start_new_game(player1_id, player2_id, num_ships, board_size, game_id):
    
    ai_thread = threading.Thread(target=start_async, args=(player1_id, player2_id, num_ships, board_size, game_id))
    ai_thread.start()

    #asyncio.run(run_game(player1_id, player2_id, num_ships, board_size, game_id))
    
    return ""

def start_async(player1_id, player2_id, num_ships, board_size, game_id):

    async def run_game():
        sys.stderr.write("run game" + str(game_id) + "\n")
    
        ### establish the websocket
        ws_url = "ws://web:8000/ws/play/{}/".format(game_id) 
        async with websockets.connect(ws_url) as websocket:

            # setup the ships
            ship_board = "-a---------a--------------------cccc-----------d---------d---------d---------d------bbb-------------"
            url = 'http://web:8000/play/confirm-ships/{}/{}/{}'.format(game_id, player2_id, ship_board)
            response = requests.get(url)

            # initialize the ai player
            ai = BattleShipAI()
            ai.attackBoard = "-"*100
            ai.type = ai_player_ids[player2_id]    # set its type to the corresponding player2_id
            

            
            # any time I have a get state, change for response = await websocket.recv()
            # url = 'http://web:8000/play/get-state/{}/{}'.format(game_id, player1_id)
            # response = requests.get(url)

            response = await websocket.recv()

            data = response.json()
            # save game_status, my_turn, and attack_board in vars
            ai.attackBoard = data["attack_board"] 
            my_turn = data["turn"]
            game_status = data["status"]

            # while the game isnt over (game_status == 0) 
            while game_status == 0:
                    
                # any time I have a get state, change for response = await websocket.recv()
                # url = 'http://web:8000/play/get-state/{}/{}'.format(game_id, player1_id)
                # response = requests.get(url)
                response = await websocket.recv()

                data = response.json()
                ai.attackBoard = data["attack_board"] 
                my_turn = data["turn"]
                game_status = data["status"]
                ai.previousShotHit = data["is_hit"]
                ai.previousShotRow = data["shot_row"]
                ai.previousShotCol = data["shot_col"]
                if my_turn == 2:
                    row, col = ai.getMove()
                    url = 'http://web:8000/play/fire-shot/{}/{}/{}/{}'.format(game_id, player2_id, row, col) 
                    response = requests.get(url)
     
        return

    sys.stderr.write("Testing \n")
    loop = asyncio.new_event_loop()
    loop.run_until_complete(run_game())
    loop.close()
    return

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 5555 
    app.run(host=host, port=port, debug=True)
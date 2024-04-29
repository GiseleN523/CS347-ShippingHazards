## maybe make some boilerplate logic for how a game will go so we can reuse it in the api??

from ai_player.ai import BattleShipAI
from game_logic.logic import *

if __name__ == '__main__':
    
    # test the inOrderAI
    aiInOrder = BattleShipAI()
    aiInOrder.attackBoard=blankBoard()
    aiInOrder.opponentShipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd"
    aiInOrder.type = "inOrder"
    aiInOrder.combinedBoard = aiInOrder.opponentShipBoard

    for location in aiInOrder.attackBoard:
        row, col = aiInOrder.getMove()
        aiInOrder.combinedBoard, aiInOrder.attackBoard = updateBoards(aiInOrder.opponentShipBoard, aiInOrder.combinedBoard, aiInOrder.attackBoard, row, col)
        print("after next shot in order")
        print ("ship board is still "+ aiInOrder.opponentShipBoard)
        print ("combined board is now: " + aiInOrder.combinedBoard)
        print ("attack board is now: " + aiInOrder.attackBoard)

    # test the randomAI

    aiRandom = BattleShipAI()
    aiRandom.attackBoard=blankBoard()
    aiRandom.opponentShipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd"
    aiRandom.type = "random"
    aiRandom.combinedBoard = aiRandom.opponentShipBoard

    for location in aiRandom.attackBoard:
        row, col = aiRandom.getMove()
        aiRandom.combinedBoard, aiRandom.attackBoard = updateBoards(aiRandom.opponentShipBoard, aiRandom.combinedBoard, aiRandom.attackBoard, row, col)
        print("after next shot randomly")
        print ("ship board is still "+ aiRandom.opponentShipBoard)
        print ("combined board is now: " + aiRandom.combinedBoard)
        print ("attack board is now: " + aiRandom.attackBoard)

    # test the targeted AI
    
    aiTargeted = BattleShipAI()
    aiTargeted.attackBoard=blankBoard()
    aiTargeted.opponentShipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd"
    aiTargeted.type = "targeted"
    aiTargeted.combinedBoard = aiTargeted.opponentShipBoard

    for location in aiTargeted.attackBoard:
        row, col = aiTargeted.getMove()
        aiTargeted.combinedBoard, aiTargeted.attackBoard = updateBoards(aiTargeted.opponentShipBoard, aiTargeted.combinedBoard, aiTargeted.attackBoard, row, col)
        print("after next shot targeted")
        print ("ship board is still    "+ aiTargeted.opponentShipBoard)
        print ("combined board is now: " + aiTargeted.combinedBoard)
        print ("attack board is now:   " + aiTargeted.attackBoard)


    # ai.attackBoard = newAttackBoard







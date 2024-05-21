## maybe make some boilerplate logic for how a game will go so we can reuse it in the api??

from ai_player.ai import *
# from game_logic.logic import *


####### the following functions are copied from game_logic.logic (once we are pushed to main we will fix the import structure )
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
    if attackRow > 9 or attackRow < 0 or attackCol > 9 or attackCol < 0:
        return False
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



if __name__ == '__main__':
    
    # test the inOrderAI
    # aiInOrder = BattleShipAI()
    # aiInOrder.attackBoard=blankBoard()
    # aiInOrder.opponentShipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd"
    # aiInOrder.type = "inOrder"
    # aiInOrder.combinedBoard = aiInOrder.opponentShipBoard

    # for location in aiInOrder.attackBoard:
    #     row, col = aiInOrder.getMove()
    #     aiInOrder.combinedBoard, aiInOrder.attackBoard = updateBoards(aiInOrder.opponentShipBoard, aiInOrder.combinedBoard, aiInOrder.attackBoard, row, col)
    #     print("after next shot in order")
    #     print ("ship board is still "+ aiInOrder.opponentShipBoard)
    #     print ("combined board is now: " + aiInOrder.combinedBoard)
    #     print ("attack board is now: " + aiInOrder.attackBoard)

    # # test the randomAI

    # aiRandom = BattleShipAI()
    # aiRandom.attackBoard=blankBoard()
    # aiRandom.opponentShipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd"
    # aiRandom.type = "random"
    # aiRandom.combinedBoard = aiRandom.opponentShipBoard

    # for location in aiRandom.attackBoard:
    #     row, col = aiRandom.getMove()
    #     aiRandom.combinedBoard, aiRandom.attackBoard = updateBoards(aiRandom.opponentShipBoard, aiRandom.combinedBoard, aiRandom.attackBoard, row, col)
    #     print("after next shot randomly")
    #     print ("ship board is still "+ aiRandom.opponentShipBoard)
    #     print ("combined board is now: " + aiRandom.combinedBoard)
    #     print ("attack board is now: " + aiRandom.attackBoard)

    # # test the targeted AI
    
    # aiTargeted = BattleShipAI()
    # aiTargeted.attackBoard=blankBoard()
    # aiTargeted.opponentShipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd"
    # aiTargeted.type = "targeted"
    # aiTargeted.combinedBoard = aiTargeted.opponentShipBoard

    # for location in aiTargeted.attackBoard:
    #     row, col = aiTargeted.getMove()
    #     aiTargeted.combinedBoard, aiTargeted.attackBoard = updateBoards(aiTargeted.opponentShipBoard, aiTargeted.combinedBoard, aiTargeted.attackBoard, row, col)
    #     print("after next shot targeted")
    #     print ("ship board is still    "+ aiTargeted.opponentShipBoard)
    #     print ("combined board is now: " + aiTargeted.combinedBoard)
    #     print ("attack board is now:   " + aiTargeted.attackBoard)


    # ai.attackBoard = newAttackBoard
    
    aiBest = BattleShipAI()
    aiBest.attackBoard=blankBoard()
    # aiBest.opponentShipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------e-----------ddddd"
    aiBest.opponentShipBoard = placeShips(5, 10)

    aiBest.opponentCombinedBoard = aiBest.opponentShipBoard
    aiBest.type = "best"
    aiBest.boardSize = 10
    aiBest.numShips = 5
    aiBest.combinedBoard = aiBest.opponentShipBoard

    # for location in aiBest.attackBoard:
    while not isWinner(aiBest.combinedBoard):
        row, col = aiBest.getMove()
        aiBest.combinedBoard, aiBest.attackBoard = updateBoards(aiBest.opponentShipBoard, aiBest.combinedBoard, aiBest.attackBoard, row, col)
        print("after next shot targeted")
        print ("ship board is still    "+ aiBest.opponentShipBoard)
        print ("combined board is now: " + aiBest.combinedBoard)
        print ("attack board is now:   " + aiBest.attackBoard)








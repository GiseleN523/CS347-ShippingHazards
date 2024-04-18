
# the board: ---------- first 10 = top row      (it will be flat)
#            ----------
#            ----------
#            ----------
#            ----------
#            ----------
#            ----------
#            ----------
#            ----------
#            ---------- last 10 = bottom row

# each player has 3 board representations:
# shipBoard
# attackBoard
# combinedBoard



# info available: board1 and board2, next attack (row, col)



# some kind of charAt or func that gives the item at certain coordinates
def charAt(board, row, col): # from Matt Lepinski connect4-server.py
    index = col + row*10
    return board[index]


# checking if a player wins
def isWinner(combinedBoard):
    for row in range(10):
        for col in range(10):
            if charAt(combinedBoard, row, col) not in ("X", "O", "-"):
                return False
    return True


# Check if the most recent attack is a valid move?
def isValidAttack(attackBoard, attackRow, attackCol):
    if charAt(attackBoard, attackRow, attackCol) == "-":
        return True
    else:
        return False

# Check if the most recent attack a hit or not
def isHit(shipBoard, attackRow, attackCol):
    char = charAt(shipBoard, attackRow, attackCol)
    if char != "-":
        return True, char
    else:
        return False, char
    
# has a ship been sunk?
def isShipSunk(combinedBoard, ship):
    for row in range(10):
        for col in range(10):
            if charAt(combinedBoard, row, col) == ship:
                return False
    return True

# start game (gives blank boardstate?) 
def blankBoard():
    return "-"*100

# updating combinedBoard and attackBoard given the attack row and col
def updateBoards(shipBoard, prevCombinedBoard, prevAttackBoard, attackRow, attackCol):
    hitStatus, char = isHit(shipBoard, attackRow, attackCol)
    if hitStatus:
        char = "X"
    else:
        char = "O"
    newCombinedBoard = updateChar(prevCombinedBoard, char, attackRow, attackCol)
    newAttackBoard = updateChar(prevAttackBoard, char, attackRow, attackCol)
    return newCombinedBoard, newAttackBoard

    

def updateChar(board, newChar, row, col):
    index = col + row*10
    # board[index] = newChar
    return board[:index] + newChar + board[index+1:]


if __name__ == '__main__':
    shipBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd"
    combinedBoard = shipBoard
    attackBoard = blankBoard()
    
    attackRow, attackCol = 2,4

    status, char = isHit(shipBoard, attackRow, attackCol)

    print("isHit: " + str(status) + ", char was " + char)

    combinedBoard, attackBoard = updateBoards(shipBoard, combinedBoard, attackBoard, attackRow, attackCol)
    print ("ship board is still "+ shipBoard)
    print ("combined board is now: " + combinedBoard)
    print ("attack board is now: " + attackBoard)

    print("take out first a")
    attackRow, attackCol = 1,1
    combinedBoard, attackBoard = updateBoards(shipBoard, combinedBoard, attackBoard, attackRow, attackCol)
    print ("ship board is still "+ shipBoard)
    print ("combined board is now: " + combinedBoard)
    print ("attack board is now: " + attackBoard)
    
    print("take out second a")
    attackRow, attackCol = 2,1
    combinedBoard, attackBoard = updateBoards(shipBoard, combinedBoard, attackBoard, attackRow, attackCol)
    print ("ship board is still "+ shipBoard)
    print ("combined board is now: " + combinedBoard)
    print ("attack board is now: " + attackBoard)

    isSunk = isShipSunk(combinedBoard, "a")
    print("did we sink the a ship: " + str(isSunk))

    winnerBoard = "-----------X---------X------------XXXX----------------X---------X---------X--------------------XXXXX"
    isWin = isWinner(winnerBoard)
    print("is this a win: " + str(isWin))



#            ----------
#            -a--------
#            -a--------
#            ----bbbb--
#            ----------
#            ----c-----
#            ----c-----
#            ----c-----
#            ---------- 
#            -----ddddd
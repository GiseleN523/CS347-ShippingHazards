
# the board: ---------- first 10 = top row      (it will be flat)
#            ----------     row 0 col 0 corresponds to 0th index (top left)
#            ----------
#            ----------
#            ----------
#            ----------
#            ----------
#            ----------
#            ----------
#            ---------- last 10 = bottom row

# each player has 3 board representations:
# shipBoard: 
#   something will need to take ship info from the database and create 
#   this board that should have each ship represented by a certain character 
#   occupying the spots in the board string that it occupies on the board.
#   This board will never change once created.
#       ex. 
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
# attackBoard:
#   The attack board will start as a blank board and will be updated with
#   X's for hits and O's for misses as the game goes on.
#       ex. 
#            ----------
#            -X--O-----
#            -X-----O--
#            ----------
#            ------OO--
#            ----XO----
#            ----------
#            ----------
#            ---------- 
#            ----OX----
# combinedBoard:
#   This board starts as the same as the ship board (with character representations 
#   for each ship). Then when attacks are sent, the same X's and O's put on the attack
#   board are put on this board (replacing characters that represent ships or empty space)
#       ex. 
#            ----------
#            -X--O----
#            -X-----O--
#            ----bbbb--
#            ------OO--
#            ----XO----
#            ----c-----
#            ----c-----
#            ---------- 
#            ----OXdddd



# this logic file is only taking in and dealing with one board at a time
# there is no logic in here that deals with comparing player1 and player2
# as we felt that should be in a dedicated file that will run the game from 
# start to finish.



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

    


if __name__ == '__main__':
    # debugging tests
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
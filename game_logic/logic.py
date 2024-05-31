
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

import random



# func that gives the item at certain coordinates
def charAt(board, row, col): # from Matt Lepinski connect4-server.py
    '''
    Input: any 10x10 board, int row, int col
    Output: the character at the (row, col) of the 10x10 board
    '''
    index = col + row*10
    return board[index]

# func that gives the row and col of the specified index
def getCoords(index, boardSize):
        '''
        Input: an index and a boardsize (board width)
        Output: the row, col of the corresponding index
        '''
        row = index//boardSize
        col = index%boardSize
        return row,col

# helper func that updates the char at certain coords in the board-string to be the new char 
def updateChar(board, newChar, row, col):
    '''
    Input: any 10x10 board, the new character, and what row and col to be updated
    Output: the updated board 
    '''
    index = col + row*10
    # board[index] = newChar
    return board[:index] + newChar + board[index+1:]

# helper func that updates char at certain index
def updateCharAtIndex(board, newChar, index):
    '''
    Input: any 10x10 board, the new character, and what index to be updated
    Output: the updated board 
    '''
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

# checks if the row, col was attacked or not
def wasAttacked(attackBoard, attackRow, attackCol, board_size):
    '''
    Input: attackBoard with only previous hits and misses, row and col of next attack
    Output: True if there has not been an attack at those coordinates before, otherwise False
    '''
    edge = board_size-1
    if attackRow > edge or attackRow < 0 or attackCol > edge or attackCol < 0:
        return False
    if charAt(attackBoard, attackRow, attackCol) == "X":
        return True
    else:
        return False
    
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


# func that returns a list of the indices that a specific ships is located at 
def getShipIndices(shipBoard, shipChar):
    '''
    Input: shipBoard and a character corresponding to a ship in the board
    Output: a list of indices where that corresponding ship is located inside the board string
    '''
    shipIndices = []
    index = 0
    for char in shipBoard:
        if char == shipChar:
            shipIndices.append(index)
        index = index+1
    return shipIndices


# number of ships and the corresponding ship lengths
ships_composition = {
        4: [2, 3, 4, 5],
        5: [2, 3, 3, 4, 5],
        6: [2, 3, 3, 4, 4, 5],
    }

# placeShips() helper
def placeOneShip(size, ship_board, ship_letter):
    # horizontal
    if random.randint(0, 1) == 0:
        row = random.randint(0, 9)
        col = random.randint(0, 10 - size)
        # check that entire ship can be placed
        for i in range(size):
            if ship_board[row * 10 + col + i] != "-":
                return False
        # place ship
        for i in range(size):
                ship_board[row * 10 + col + i] = ship_letter
    # vertical
    else: 
        row = random.randint(0, 10 - size)
        col = random.randint(0, 9)
        # check that entire ship can be placed
        for i in range(size):
            if ship_board[(row + i) * 10 + col] != "-":
                return False
        # place ship
        for i in range(size):
                ship_board[(row + i) * 10 + col] = ship_letter
    return True

# randomize board configuration based on either 4, 5, or 6 ships
def placeShips(num_ships, board_size):
    ship_board = ["-" for _ in range(board_size * board_size)]

    ship_index = 0
    for size in ships_composition[num_ships]:
        placed = False
        ship_index += 1
        # https://www.pythoncheatsheet.org/builtin/chr
        # https://en.wikipedia.org/wiki/List_of_Unicode_characters
        ship_letter = chr(ship_index + 96) 
        while placed == False:
            placed = placeOneShip(size, ship_board, ship_letter)

    return ''.join(ship_board)





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
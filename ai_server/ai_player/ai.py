# import sys
# import random
# # from ..game_logic.logic import * 

# ####### the following functions are copied from game_logic.logic (once we are pushed to main we will fix the import structure )
# def isHit(shipBoard, attackRow, attackCol):
#     '''
#     Input: shipBoard, row and col of next attack
#     Output: Whether there is a ship at the coordinates of the attack (True or False), and the char at the location of the attack
#     '''
#     char = charAt(shipBoard, attackRow, attackCol)
#     if char != "-":
#         return True, char
#     else:
#         return False, char
    
# def isValidAttack(attackBoard, attackRow, attackCol):
#     '''
#     Input: attackBoard with only previous hits and misses, row and col of next attack
#     Output: True if there has not been an attack at those coordinates before, otherwise False
#     '''
#     if attackRow > 9 or attackRow < 0 or attackCol > 9 or attackCol < 0:
#         return False
#     if charAt(attackBoard, attackRow, attackCol) == "-":
#         return True
#     else:
#         return False
    
# def charAt(board, row, col): # from Matt Lepinski connect4-server.py
#     '''
#     Input: any 10x10 board, int row, int col
#     Output: the character at the (row, col) of the 10x10 board
#     '''
#     index = col + row*10
#     return board[index]


# class BattleShipAI:

#     def __init__(self):
#         self.targetStack = [] 
#         self.type = ""
#         self.attackBoard = ""
#         self.opponentShipBoard = ""
#         self.combinedBoard = ""
#         self.previousShotHit = 0
#         self.previousShotRow = 0
#         self.previousShotCol = 0

#     def getCoords(self, index):
#         row = index//10
#         col = index%10
#         return row,col

#     # goes in order
#     def inOrderAI(self):
#         i = 0
#         for location in self.attackBoard:
#             if location == "-":
#                 return self.getCoords(i)
#             else:
#                 i = i+1
#         return "no valid attack available"
        
            
#     # chooses spots randomly that haven't been shot before
#     def randomAttack(self):
#         index = random.randint(0,len(self.attackBoard)-1)
#         while self.attackBoard[index] != "-":
#             # index += 1
#             index = random.randint(0,len(self.attackBoard)-1)

#         return self.getCoords(index)


#     # eventually make "informed guesses" based on previous hits/misses:
#     # when an attack is a hit, add squares around it (top, below, left, right) to targetStack
#     # structure from: https://towardsdatascience.com/coding-an-intelligent-battleship-agent-bf0064a4b319
#     def targetedAttack(self):
        
#         if self.previousShotHit == 1:
#             aboveRow, aboveCol = self.previousShotRow-1, self.previousShotCol
#             belowRow, belowCol = self.previousShotRow+1, self.previousShotCol
#             rightRow, rightCol = self.previousShotRow, self.previousShotCol+1
#             leftRow, leftCol = self.previousShotRow, self.previousShotCol-1
#             possibleTargets = [(aboveRow, aboveCol), (belowRow, belowCol), (rightRow, rightCol), (leftRow, leftCol)]

#             for row, col in possibleTargets:
#                 if isValidAttack(self.attackBoard, row, col): # there has been no previous shot there
#                     self.targetStack.append((row, col))
        
        
#         # if length of target stack is 0, do randomAttack
#         if len(self.targetStack) == 0:
#             print("attempt a random attack")
#             attackRow, attackCol = self.randomAttack()
#         else:
#             print("attempt a targeted attack")
#             attackRow, attackCol = self.targetStack.pop()
        
#         # status, char = isHit(self.opponentShipBoard, attackRow, attackCol) ## need to import logic functions! also have access to opponentShipBoard
#         # if status:  
#         #     # add square above, below, right, and left to targetStack (if they are not previous shots already)
#         #     print("adding surrounding possible targets")
#         #     aboveRow, aboveCol = attackRow-1, attackCol
#         #     belowRow, belowCol = attackRow+1, attackCol
#         #     rightRow, rightCol = attackRow, attackCol+1
#         #     leftRow, leftCol = attackRow, attackCol-1
#         #     possibleTargets = [(aboveRow, aboveCol), (belowRow, belowCol), (rightRow, rightCol), (leftRow, leftCol)]

#         #     for row, col in possibleTargets:
#         #         if isValidAttack(self.attackBoard, row, col): # there has been no previous shot there
#         #             self.targetStack.append((row, col))
    
#         return attackRow, attackCol
        

#     def getMove(self):
#         if self.type == "inOrder":
#             return self.inOrderAI()
#         elif self.type == "random":
#             return self.randomAttack()
#         elif self.type == "targeted":
#             return self.targetedAttack()


import sys
import random
# from game_logic.logic import * 


# func that gives the item at certain coordinates
def charAt(board, row, col): # from Matt Lepinski connect4-server.py
    '''
    Input: any 10x10 board, int row, int col
    Output: the character at the (row, col) of the 10x10 board
    '''
    index = col + row*10
    # if index > 100 or index < 0:
    #     return "-"
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

def updateCharAtIndex(board, newChar, index):
    '''
    Input: any 10x10 board, the new character, and what index to be updated
    Output: the updated board 
    '''
    return board[:index] + newChar + board[index+1:]


# start game (gives blank boardstate) 
def blankBoard():
    return "-"*100


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

def getCoords(index, boardSize):
        '''
        Input: an index and a boardsize (board width)
        Output: the row, col of the corresponding index
        '''
        row = index//boardSize
        col = index%boardSize
        return row,col

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

# eventually make this able to be read in from a separate file maybe?
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



class BattleShipAI:

    # TODO: add better AI that uses smarter surveying shots instead of random

    # TODO: make better AI continue attacking along one line once two hits next to each other

    def __init__(self):
        self.highPriorityStack = [] 
        self.lowPriorityStack = [] 
        self.type = ""
        self.numShips = 0
        self.boardSize = 0
        self.opponentsShipsLeft = [] # idk if we're using this
        self.sunkShips = "-"*100
        self.attackBoard = "-"*100
        self.opponentCombinedBoard = ""
        self.opponentShipBoard = ""
        self.combinedBoard = ""
        self.previousShotHit = 0
        self.previousShotSunk = 0
        self.previousShotRow = 0
        self.previousShotCol = 0

    

    # goes in order
    def inOrderAI(self):
        i = 0
        for location in self.attackBoard:
            if location == "-":
                return getCoords(i, self.boardSize)
            else:
                i = i+1
        return "no valid attack available"
        
            
    # chooses spots randomly that haven't been shot before
    def randomAttack(self):
        index = random.randint(0,len(self.attackBoard)-1)
        print("index is: ", index)
        while self.attackBoard[index] != "-":
            # index += 1
            index = random.randint(0,len(self.attackBoard)-1)
        print("returning random attack", flush=True)

        return getCoords(index, self.boardSize)
    
    def getSmallestShipSizeLeft(self):
        ### make sure front end returns ship boards with these corresponding characters
        # ships_composition = {
        #         4: [2, 3, 4, 5],
        #         5: [2, 3, 3, 4, 5],
        #         6: [2, 3, 3, 4, 4, 5],
        #     }

        shipChars = {
            4: ["a", "b", "c", "d"],
            5: ["a", "b", "c", "d", "e"],
            6: ["a", "b", "c", "d", "e", "f"]
        }
        print("in smallest ship size fn", flush=True)
        print("opponent combined board is",self.opponentCombinedBoard)
        possibleShips = shipChars[self.numShips]
        index = 0
        if self.opponentCombinedBoard == "":
            return 2
        for ship in possibleShips:
            for char in self.opponentCombinedBoard:
                if ship == char:
                    print("found ship char", flush=True)
                    return ships_composition[self.numShips][index]
            index = index + 1

        return ""
    
    def getSurroundingLocations(self, row, col):
        aboveRow, aboveCol = row-1, col
        belowRow, belowCol = row+1, col
        rightRow, rightCol = row, col+1
        leftRow, leftCol = row, col-1
        possibleTargets = [(aboveRow, aboveCol), (belowRow, belowCol), (rightRow, rightCol), (leftRow, leftCol)]
        random.shuffle(possibleTargets)
        return possibleTargets
    
    def outOfBounds(self, location):
        edge = self.boardSize-1
        if location > edge or location < 0:
            return True
        else:
            return False
        


    # function structure from: https://towardsdatascience.com/coding-an-intelligent-battleship-agent-bf0064a4b319
    # uses smallest ship size to narrow down coordinates that the ship must be on
    def betterRandomAttack(self):
        print("entered better random fn", flush=True)

        # determine which is the smallest ship left on the board
        smallestShipSize = self.getSmallestShipSizeLeft()
        print("got smallest ships size: ", smallestShipSize, flush=True)

        while True:
            guess_row, guess_col = random.choice(range(10)), random.choice(range(10))
            print("got a guess", flush=True)

            if (guess_row + guess_col) % smallestShipSize != 0:
                print("if was true", flush=True)
                continue
            print("if was false", flush=True)
            if isValidAttack(self.attackBoard, guess_row, guess_col):
                print("attack was valid so break", flush=True)

                break
            print("attack was not valid so loop", flush=True)

        print("got better guess", flush=True)

        return guess_row, guess_col

        # while True:
        #     guess_row, guess_col = random.choice(range(10)), random.choice(range(10))
        #     print("random guesses", flush=True)

        #     if ((guess_row + guess_col) % int(smallestShipSize)) != 0:
        #         if isValidAttack(self.attackBoard, guess_row, guess_col):
        #             print("got better guess", flush=True)
        #             return guess_row, guess_col
        #         print("was not valid", flush=True)
        #     print("did not equal 0", flush=True)
        #     continue


    # make "informed guesses" based on previous hits/misses:
    # when an attack is a hit, add squares around it (top, below, left, right) to targetStack
    # structure from: https://towardsdatascience.com/coding-an-intelligent-battleship-agent-bf0064a4b319
    def targetedAttack(self):
        print("entered targeted attack function", flush=True)
        if self.previousShotHit == 1:
            print("prev shot hit", flush=True)
            possibleTargets = self.getSurroundingLocations(self.previousShotRow, self.previousShotCol)
            print("retrieved targets", flush=True)

            for row, col in possibleTargets:
                print("checking targets", flush=True)

                if isValidAttack(self.attackBoard, row, col): # there has been no previous shot there
                    self.highPriorityStack.append((row, col))
        
        
        # if length of target stack is 0, do randomAttack
        if len(self.highPriorityStack) == 0:
            print("attempt a random attack", flush=True)
            attackRow, attackCol = self.randomAttack()
        else:
            print("attempt a targeted attack", flush=True)
            attackRow, attackCol = self.highPriorityStack.pop()
        
        
        return attackRow, attackCol
    
    # betterAI clears the stack when a shot has been hit, keeps attacking in a line when multiple 
    # shots have hit in a row, and uses more efficient surveying shots instead of random 
    def betterTargetedAttack(self):
        print("entered better targeted attack func", flush=True)
        # if the previous shot hit but did not sink a ship
        if self.previousShotHit == 1 and self.previousShotSunk == 0:
            print("entered first if", flush=True)
            ### if there is a hit above or below previoushit's location
            aboveRow = self.previousShotRow - 1
            # aboveIndex = (self.previousShotCol + above*10)
            belowRow = self.previousShotRow + 1
            # if aboveIndex < 100 or aboveIndex < 0:
            addedTargets = False
            ### need to finish error checking for out of bounds indexes (this is where its breaking for ai 3)
            # if charAt(self.attackBoard, above, below) == "X" or charAt(self.combinedBoard, self.previousShotRow + 1, self.previousShotCol) == "X":
            if wasAttacked(self.attackBoard, aboveRow, self.previousShotCol, self.boardSize) or wasAttacked(self.attackBoard, belowRow, self.previousShotCol, self.boardSize):
                print("passed first if: a hit above or below", flush=True)

                # add above those hits in a line to the higher prio stack
                # aboveRow = self.previousShotRow - 1
                # keep shifting up until find a "O" or "-"
                if not self.outOfBounds(aboveRow):
                    while charAt(self.attackBoard, aboveRow, self.previousShotCol) == "X":
                        aboveRow -= 1
                        if self.outOfBounds(aboveRow):
                            print("was out of bounds", flush=True)
                            break
                # # if there has been no attack at this index
                    if not self.outOfBounds(aboveRow) and charAt(self.attackBoard, aboveRow, self.previousShotCol) != "O":
                #     self.highPriorityStack.append((aboveRow, self.previousShotCol))
                        self.highPriorityStack.append((aboveRow, self.previousShotCol))

                # add below to higher prio stack
                # keep shifting up until find a "O" or "-"
                if not self.outOfBounds(belowRow):
                    while charAt(self.attackBoard, belowRow, self.previousShotCol) == "X":
                        belowRow += 1
                        if self.outOfBounds(belowRow):
                            print("was out of bounds", flush=True)
                            break
                # # if there has been no attack at this index
                    if not self.outOfBounds(belowRow) and charAt(self.attackBoard, belowRow, self.previousShotCol) != "O":
                #     self.highPriorityStack.append((belowRow, self.previousShotCol))
                        self.highPriorityStack.append((belowRow, self.previousShotCol))

                # add left to lower prio stack
                if isValidAttack(self.attackBoard, self.previousShotRow, self.previousShotCol - 1):
                    self.lowPriorityStack.append((self.previousShotRow, self.previousShotCol - 1))

                # add right to lower prio stack
                if isValidAttack(self.attackBoard, self.previousShotRow, self.previousShotCol + 1):
                    self.lowPriorityStack.append((self.previousShotRow, self.previousShotCol + 1))
                addedTargets = True


            ### if there is a hit to left or right of previous hits location
            leftCol = self.previousShotCol - 1
            rightCol = self.previousShotCol + 1
            # if charAt(self.attackBoard, self.previousShotRow, self.previousShotCol-1) == "X" or charAt(self.combinedBoard, self.previousShotRow, self.previousShotCol+1) == "X":
            if wasAttacked(self.attackBoard, self.previousShotRow, leftCol, self.boardSize) or wasAttacked(self.attackBoard, self.previousShotRow, rightCol, self.boardSize):
                print("passed second if, hit to left or right", flush=True)

                # add left to high prio stack
                # leftCol = self.previousShotCol - 1
                # keep shifting to the left until find a "O" or "-"
                if not self.outOfBounds(leftCol):
                    # while wasAttacked(self.attackBoard, self.previousShotRow, leftCol, self.boardSize):
                    while charAt(self.attackBoard, self.previousShotRow, leftCol) == "X":
                        print("shifting left", flush=True)
                        leftCol -= 1
                        if self.outOfBounds(leftCol):
                            print("was out of bounds", flush=True)
                            break
                # # if there has been no attack at this index
                    if not self.outOfBounds(leftCol) and charAt(self.attackBoard, self.previousShotRow, leftCol) != "O":
                #     self.highPriorityStack.append((self.previousShotRow, leftCol))
                        print("adding", self.previousShotRow, leftCol, flush=True)
                        self.highPriorityStack.append((self.previousShotRow, leftCol))


                # add right to higher prio stack
                # rightCol = self.previousShotCol + 1
                # keep shifting to the right until find a "O" or "-"
                if not self.outOfBounds(rightCol):
                    print("right col is not out of bounds", rightCol, flush=True)
                    while charAt(self.attackBoard, self.previousShotRow, rightCol) == "X":
                        print("shifting right", flush=True)
                        rightCol += 1
                        if self.outOfBounds(rightCol):
                            print("was out of bounds", flush=True)
                            break
                # # tif here has been no attack at this index
                    if not self.outOfBounds(rightCol) and charAt(self.attackBoard, self.previousShotRow, rightCol) != "O":
                #     self.highPriorityStack.append((self.previousShotRow, rightCol))
                        print("adding", self.previousShotRow, rightCol, flush=True)

                        self.highPriorityStack.append((self.previousShotRow, rightCol))

                # add above to lower prio
                if isValidAttack(self.attackBoard, self.previousShotRow - 1, self.previousShotCol):
                    self.lowPriorityStack.append((self.previousShotRow - 1, self.previousShotCol))

                # add below to lower prio stack
                if isValidAttack(self.attackBoard, self.previousShotRow + 1, self.previousShotCol):
                    self.lowPriorityStack.append((self.previousShotRow + 1, self.previousShotCol))
                print("added targets", flush=True)
                addedTargets = True
            
            # if there was no hit above/below/left/right
            if addedTargets == False:
                print("there was no hit above/below/left/right of the previous hit")
                possibleTargets = self.getSurroundingLocations(self.previousShotRow, self.previousShotCol)
                print("retrieved targets", flush=True)

                for row, col in possibleTargets:
                    print("checking targets", flush=True)
                    if isValidAttack(self.attackBoard, row, col): # there has been no previous shot there
                        self.lowPriorityStack.append((row, col))



            
    
        # if the previous hit and sunk a ship
        elif self.previousShotHit == 1 and self.previousShotSunk == 1:
            print("entered elif", flush=True)
            # clear BOTH stacks
            while (self.highPriorityStack != []):
                self.highPriorityStack.pop()
            while (self.lowPriorityStack!= []):
                self.lowPriorityStack.pop()
            # add indices of ship to running list of sunk ship indices
            shipIndices = getShipIndices(self.opponentShipBoard, charAt(self. opponentShipBoard, self.previousShotRow, self.previousShotCol))
            for index in shipIndices:
                self.sunkShips = updateCharAtIndex(self.sunkShips, "X", index)
            # walk through each character of the attackboard
            for i in range(len(self.attackBoard)):
                # find hits in attack board not part of sunken ships
                if self.attackBoard[i] == "X" and self.sunkShips[i] == "-":
                    # add locations surrounding i to the lower prio stack
                    row, col = getCoords(i, self.boardSize)
                    possibleTargets = self.getSurroundingLocations(row, col)
                    for row, col in possibleTargets:
                        if isValidAttack(self.attackBoard, row, col): # there has been no previous shot there
                            self.lowPriorityStack.append((row, col))



        print("trying to pop a shot off", flush=True)
        ## if there are high priority targets, shoot from them
        if len(self.highPriorityStack) != 0:
            print("getting a high prio", flush=True)

            attackRow, attackCol = self.highPriorityStack.pop()
        ## if there are low priority targets, shoot from them
        elif len(self.lowPriorityStack) != 0:
            print("getting a low prio", flush=True)

            attackRow, attackCol = self.lowPriorityStack.pop()
        ## else shoot with better random attack
        else:
            print("getting a better random", flush=True)

            attackRow, attackCol = self.betterRandomAttack()
        print("going to return attack row and col", attackRow, attackCol, flush=True)
        return attackRow, attackCol
        

    def getMove(self):
        if self.type == "inOrder":
            return self.inOrderAI()
        elif self.type == "random":
            print("trying to get random attack", flush=True)
            return self.randomAttack()
        elif self.type == "targeted":
            return self.targetedAttack()
        elif self.type == "best":
            return self.betterTargetedAttack()
        
        


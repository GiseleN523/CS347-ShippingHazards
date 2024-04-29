import sys
import random
from game_logic.logic import * 


class BattleShipAI:

    def __init__(self):
        self.targetStack = [] 
        self.type = ""
        self.attackBoard = ""
        self.opponentShipBoard = ""
        self.combinedBoard = ""

    def getCoords(self, index):
        row = index//10
        col = index%10
        return row,col

    # goes in order
    def inOrderAI(self):
        i = 0
        for location in self.attackBoard:
            if location == "-":
                return self.getCoords(i)
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

        return self.getCoords(index)


    # eventually make "informed guesses" based on previous hits/misses:
    # when an attack is a hit, add squares around it (top, below, left, right) to targetStack
    # structure from: https://towardsdatascience.com/coding-an-intelligent-battleship-agent-bf0064a4b319
    def targetedAttack(self):
        # if length of target stack is 0, do randomAttack
        if len(self.targetStack) == 0:
            print("attempt a random attack")
            attackRow, attackCol = self.randomAttack()
        else:
            print("attempt a targeted attack")
            attackRow, attackCol = self.targetStack.pop()
        
        status, char = isHit(self.opponentShipBoard, attackRow, attackCol) ## need to import logic functions! also have access to opponentShipBoard
        if status:  
            # add square above, below, right, and left to targetStack (if they are not previous shots already)
            print("adding surrounding possible targets")
            aboveRow, aboveCol = attackRow-1, attackCol
            belowRow, belowCol = attackRow+1, attackCol
            rightRow, rightCol = attackRow, attackCol+1
            leftRow, leftCol = attackRow, attackCol-1
            possibleTargets = [(aboveRow, aboveCol), (belowRow, belowCol), (rightRow, rightCol), (leftRow, leftCol)]

            for row, col in possibleTargets:
                if isValidAttack(self.attackBoard, row, col): # there has been no previous shot there
                    self.targetStack.append((row, col))
    
        return attackRow, attackCol
        

    def getMove(self):
        if self.type == "inOrder":
            return self.inOrderAI()
        elif self.type == "random":
            return self.randomAttack()
        elif self.type == "targeted":
            return self.targetedAttack()


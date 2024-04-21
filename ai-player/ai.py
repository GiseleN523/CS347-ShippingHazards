import sys
import random

# sys.path.insert(1,r"C:\Users\jboog\StuWork\cs347\CS347-ShippingHazards")

# # from .gamelogic.logic import *

# import gamelogic.logic

# from ..gamelogic import logic


# input:
#   opponent's attackBoard
#   (in the future, maybe) oponent's shipBoard


def getCoords(index):
    row = index//10
    col = index%10
    return row,col
    

# goes in order
def inOrderAI(attackBoard):
    i = 0
    for location in attackBoard:
        if location == "-":
            return getCoords(location)
        else:
            i = i+1
    return "no valid attack available"
    
        
# chooses spots randomly that haven't been shot before
def randomAttack(attackBoard):
    index = random.randint(0,len(attackBoard))
    while attackBoard[index] != "-":
        index += 1
    return getCoords(index)

# eventually make "informed guesses" based on previous hits/misses 


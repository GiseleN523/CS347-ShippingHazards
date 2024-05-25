# Shipping Hazards: A Game By Pink Puffy Rhinos

This is a project written by Cece che Tita, Gisele Nelson, Willow Gu, Josh Meier, Kendra Winhall, and Ryan Dunn in Spring 2024 for CS 347 (Advanced Software Design) at Carleton College in Northfield, MN.

Our team contract can be viewed [here](https://docs.google.com/document/d/1H5b6Cntb_txxInkAW63TwXGf1gbiXd-rTBSbk672Mnk/edit?usp=sharing).

## The Game
Shipping Hazards is an implmentation of the popular game Battleship, in which players have a fleet of ships that are hidden from their opponent. Players attempt to sink all of their opponent's ships in order to win. In this implementation, users can play against various computer players with different difficulty levels.

## How to Play
1. Clone the repository and navigate to it in the terminal
2. Type: docker-compose up -d --build
3. Go to http://localhost:3000/ in your browser
If you encounter any issues, please follow our [walkthrough](https://github.com/GiseleN523/CS347-ShippingHazards/blob/main/battleship/loaddata_walkthrough.txt).

## Folders
* The Frontend folder contains the code for the graphical user interface of our game.
* The ai_server folder contains the code for the computer players.
* The battleship folder contains the code for the database and web server.
  - We use PostgreSQL for our database and Django for our web framework.
* The game_logic folder contains the code for the game logic.

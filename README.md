# Shipping Hazards: A Game By Pink Puffy Rhinos

This is a project written by Cece che Tita, Gisele Nelson, Willow Gu, Josh Meier, Kendra Winhall, and Ryan Dunn in Spring 2024 for CS 347 (Advanced Software Design) at Carleton College in Northfield, MN.

Our team contract can be viewed [here](https://docs.google.com/document/d/1H5b6Cntb_txxInkAW63TwXGf1gbiXd-rTBSbk672Mnk/edit?usp=sharing).

## The Game
Shipping Hazards is an implementation of the popular game Battleship, in which players have a fleet of ships that are hidden from their opponent. Players attempt to sink all of their opponent's ships in order to win the game. In this implementation, users can play against various computer players with different difficulty levels.

## How to Play
1. Clone the repository and navigate to it in the terminal
2. Type: docker-compose up -d --build
3. If this is your first time playing you will need to follow the POPULATING THE DATABASE section in the [walkthrough](https://github.com/GiseleN523/CS347-ShippingHazards/blob/main/battleship/loaddata_walkthrough.txt)
4. Go to http://localhost:3000/ in your browser
   
If you encounter any issues, please follow our [walkthrough](https://github.com/GiseleN523/CS347-ShippingHazards/blob/main/battleship/loaddata_walkthrough.txt).

## Features
* Various colors, sounds, pop-ups, and music add excitement to the game.
* Customizable ship colors, ship placement, and screen names encourage creativity and novelty.
* Three computer opponents, with different levels of difficulty, add variety to the game.
* Websockets facilitate real-time communication, ensuring that gameplay is engaging and fast-paced.
* Account creation and login capabilities allow users to save their account data and preferences.
* Users, players, boards, and games can be viewed and changed from the admin site.
* Multiplayer games and the capability to rejoin games in progress. 

## Folders
* The Frontend folder contains the code for the graphical user interface of our game.
  - We use JavaScript, React, and CSS for our frontend.
* The ai_server folder contains Python code for the computer players.
* The battleship folder contains the code for the database and web server.
  - We use Django for our web framework, Django Channels for our websockets, and PostgreSQL for our database.
* The game_logic folder contains Python code for the game logic.

## Other Files
* Each folder has a Dockerfile that assembles the image for a particular component of the app.
* docker-compose.yml defines and runs the services and volumes for the entire project.
* populateData.json contains initial data for the database.

## Screenshots
<img width="1440" alt="login" src="https://github.com/GiseleN523/CS347-ShippingHazards/assets/113497140/3c280ef5-0c00-4018-89ac-29ccfcde66e1">
<br>
<br/>
This is the login page.
<br>
<br/>
<img width="1440" alt="stats_page" src="https://github.com/GiseleN523/CS347-ShippingHazards/assets/113497140/77956ca3-ff22-4218-ab50-05c98a1ab773">
<br>
<br/>
This is the player stats page, note the customizable screen name and ship color.
<br>
<br/>
<img width="1439" alt="ship_colors" src="https://github.com/GiseleN523/CS347-ShippingHazards/assets/113497140/60af551f-e7c6-4857-8cd0-dde7e060db55">
<br>
<br/>
Missed shots are denoted by white squares, successful hits are denoted by red squares, and sunk ships are denoted by gray squares. The blue square marks the square that the user's cursor is on.   
<br>
<br/>
<img width="1440" alt="hit_popup" src="https://github.com/GiseleN523/CS347-ShippingHazards/assets/113497140/4497a949-c081-48e0-8ff9-7317761f9acf">
<br>
<br/>
This is the popup marking a successful hit.   
<br>
<br/>


<img width="1440" alt="sunk_popup" src="https://github.com/GiseleN523/CS347-ShippingHazards/assets/113497140/cafc5fc4-2bec-4b73-be03-4a734b7d75e8">
This is the popup marking a sunk ship.   


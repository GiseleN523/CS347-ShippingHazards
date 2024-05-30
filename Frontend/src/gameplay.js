/*
  Page where user can play battleship game, either against an AI or another player
  Game ID is shown in the top right corner if the game is against another player
  
*/

import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import hitImage from './images/HitPopup.png';
import sunkImage from './images/SunkPopup.png';
import hitSound from './sounds/hitSound.mp3'; 
import missSound from './sounds/missSound.mp3'; 
import sunkSound from './sounds/sunkSound.mp3';

const blankBoard = "----------------------------------------------------------------------------------------------------";
let playerBoard = "-----------a---------a------------cccc----------------b---------b---------b--------------------ddddd";
let selectedShip = null; // used in ship placement phase - ex - [[0, 0], [0, 1], [0, 2], [0, 3]]
let playerID;
let username;
let gameID;
let boardSize;
let socket;
let shipColor;
let playerNum;
let isAIGame;

//returns a list of coordinates of all squares that make up the ship at given coordinates
//input ex: [0, 0]
//output ex: [[0, 0], [0, 1], [0, 2], [0, 3]]
function entireShipAt(id, board) {
  let row = Number(id.slice(id.indexOf("-")+1, id.lastIndexOf("-")));
  let col = Number(id.slice(id.lastIndexOf("-")+1));
  let coords=[];
  let letter=board[(row*boardSize)+col];
  for(let r=0; r<boardSize; r++) {
    for(let c=0; c<boardSize; c++) {
      if(board[(r*boardSize)+c] === letter) {
        coords.push([r, c]);
      }
    }
  }
  return coords;
}

// returns whether it would be legal for selectedShip to move according to changeFunct
// illegal means ship would go out of bounds of board or would overlap with another ship
// changeFunct is a function that takes a length 2 array of coordinates + a ship and returns the modified coordinates
function legalSelectedShipMovement(changeFunct) {
  for(let i=0; i<selectedShip.length; i++) {
    let ship = selectedShip[i];
    let newCoords = changeFunct(ship, selectedShip);
    let row = newCoords[0];
    let col = newCoords[1];
    // new square out of board bounds or already contains a ship (not another part of the selected ship)
    if(row < 0 || row >= boardSize || col < 0 || col >= boardSize || (playerBoard[(row*boardSize)+col] !== "-" && playerBoard[(row*boardSize)+col] !== playerBoard[(ship[0]*boardSize)+ship[1]])) {
      return false;
    }
  }
  return true;
}

// move selectedShip according to changeFunct: update playerBoard and GUI
// changeFunct is a function that takes a length 2 array of coordinates + a ship and returns the modified coordinates
function applySelectedShipMovement(changeFunct) {

  let shipLetter = playerBoard[(selectedShip[0][0]*boardSize)+selectedShip[0][1]]; // letter for this ship in playerBoard (a, b, c, d)

  // first reset all old ship squares to blank
  for (let i = 0; i < selectedShip.length; i++) {
    let ship = selectedShip[i];
    let id = "mysquare-" + ship[0] + "-" + ship[1];
    document.getElementById(id).style.backgroundColor = "rgba(0, 0, 0, 0)";
    let ind = (ship[0]*boardSize)+ship[1]; // index in playerBoard
    playerBoard = playerBoard.substring(0, ind) + "-" + playerBoard.substring(ind+1);
    let newCoords = changeFunct(ship, selectedShip);
    ship[0] = newCoords[0];
    ship[1] = newCoords[1];
  }

  // then set new ship squares
  selectedShip.forEach(function(ship) {
    let id = "mysquare-" + ship[0] + "-" + ship[1];
    document.getElementById(id).style.backgroundColor = "blue";
    let ind = (ship[0]*boardSize)+ship[1]; // index in playerBoard
    playerBoard = playerBoard.substring(0, ind) + shipLetter + playerBoard.substring(ind+1);
  });
}

// square on the board grid
function BoardSquare({id, row, column, myBoard, status}) {

  const [attackable, setAttackable] = useState(true); // whether the square has already been attacked or is still attackable

  // on click during setup stage, reset selected ship and select the ship this square is part of, if any
  function handleClickSetup() {
    if(myBoard) {
      if(selectedShip !== null) { // reset selected ship
        selectedShip.forEach(function(ship) {
          let id = "mysquare-" + ship[0] + "-" + ship[1];
          document.getElementById(id).style.backgroundColor = shipColor;
        })
      }
      selectedShip = null;
      if(playerBoard[(row*boardSize)+column] !== "-") {
        selectedShip = entireShipAt(id, playerBoard); // set new selected ship
        selectedShip.forEach(function(ship) {
          let id = "mysquare-" + ship[0] + "-" + ship[1];
          document.getElementById(id).style.backgroundColor = "blue";
        });
      }
    }
  }

  // on click during gameplay stage, if player's turn and square has not already been attacked, call fire shot endpoint
  function handleClickGameplay() {
    if(!myBoard && status === "player_turn" && document.getElementById(id).style.backgroundColor !== "white" && document.getElementById(id).style.backgroundColor !== "red") {
      setAttackable(false);
      let url = "/play/fire-shot/" + gameID + "/" + playerID + "/" + row+"/" + column;
      fetch(url)
        .catch(error => console.error('Error fetching fire shot: ', error));
    }
  }

  function handleMouseEnter() {
    if(!myBoard && status === "player_turn" && attackable) {
      document.getElementById(id).style.backgroundColor = "blue";
    }
  }

  function handleMouseLeave() {
    if(!myBoard && status === "player_turn" && attackable) {
      document.getElementById(id).style.backgroundColor = 'inherit';
    }
  }

  return (
    <div className="board-square" id={id}
      onClick={status === "setup" ? handleClickSetup : handleClickGameplay}
      onMouseEnter = {status === "player_turn" ? handleMouseEnter : null}
      onMouseLeave = {status === "player_turn" ? handleMouseLeave : null}
      style={{backgroundColor:
           (function() {
            if(myBoard && playerBoard[(row*boardSize)+column] !== "-") {
              return shipColor;
            }
            else
              return 'transparent';
            }
           )()
      }}>
    </div>
  )
}
  
// one row in a board grid
function BoardRow({row, myBoard, status}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      let key = (myBoard? "mysquare-" : "opponentsquare-")+row+"-"+i;
      arr.push(<BoardSquare key={key} id={key} row={row} column={i} myBoard={myBoard} status={status} />);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
// the board/grid on which gameplay takes place
function Board({myBoard, status, hitPopupVisible, sunkPopupVisible}) {
  let arr = [];
  for(let i=0; i<boardSize; i++) {
    arr.push(<BoardRow key={"row"+i} row={i} myBoard={myBoard} status={status} />);
  }
  return (
    <div className="board">
      {arr}
      <ComicPopup isVisible={hitPopupVisible} image={hitImage}></ComicPopup>
      <ComicPopup isVisible={sunkPopupVisible} image={sunkImage}></ComicPopup>
    </div>
  )
}
  
// instructions which are displayed between the two boards
// prompts player what to do based on game status
function Instructions({status}) {
    return (
      <div id="gameplay-instructions">
        {function() {
          if(status === "setup") {
            return "Setup Stage: Click on a ship to select it, then use the Arrow Keys to move it, the Spacebar to rotate, and the Enter key to place it";
          }
          else if (status === "player_turn") {
            return "Your Turn: Choose a square on your opponent's board to attack";
          }
          else if(status === "opp_turn" || status === "setup_confirmed") {
            return "Waiting for opponent...";
          }
        }()}
      </div>
    )
}

// button used by player to confirm their ship placement
// when clicked, fetches confirm-ships endpoint and status is switched to "setup_confirmed"
// once the opponent has also confirmed their ships, gameplay can start
function ConfirmButton({status, setStatus}) {

  function handleClick() {
    // if there is a ship selected, unselect it
    if(selectedShip !== null) {
      selectedShip.forEach(function(ship) {
        let id = "mysquare-" + ship[0] + "-" + ship[1];
        document.getElementById(id).style.backgroundColor = shipColor;
      });
      selectedShip = null;
    }

    setStatus("setup_confirmed");
    let url = "/play/confirm-ships/" + gameID + "/" + playerID + "/" + playerBoard;
    fetch(url)
      .catch(error => console.error('Error fetching confirm ships:', error));
  }

  return (
    <div style={{width: '100%', textAlign: 'center', paddingBottom: "2%"}}>
      <button
          style={{display: status === "setup" ? 'inline' : 'none'}}
          onClick={handleClick}>
        Confirm!
      </button>
    </div>
  )
}

// popup that appears when status is equal to "player_won" or "opp_won"
// includes a message with the player who won and a button back to home
function GameOverPopup({status}) {

  const navigate = useNavigate();

  return (
    <div id="gameOverPopup" style={{visibility: (status === "player_won" || status === "opp_won") ? 'visible' : 'hidden'}}>
      <div>GAME OVER</div>
      <div>{status === "player_won" ? "You Won!" : "You Lost :("}</div><br></br>
      <button onClick={() => navigate("/home/"+username)}>Back to Home</button>
    </div>
  )
}

// popup that is shown on top of a player's board when their opponent has hit or sunk one of their ships
// image is the link to the image file and isVisible is a state that controls the popup's visibility
function ComicPopup({isVisible, image}) {
  return (
    <div style={{
      width: '120%',
      display: (isVisible === true) ? 'block' : 'none',
      position: 'absolute',
      top: '5%',
      left: '-10%'
      }}>
      <img style={{width: '100%'}} src={image} alt="Comic-book style popup with the words 'hit' or 'ship sunk'"></img>
    </div>
  )
}

// component that includes both boards, a title for each, and the instructions/confirm button in between
function BoardsAndTitles({status, setStatus, popups1, popups2}) {

    useEffect(() => {

      if (status === "setup") {
        document.addEventListener('keydown', handleKeys);
      }
      return () => document.removeEventListener('keydown', handleKeys);
    });

    // event listener called when user presses a key during setup stage
    function handleKeys(e) {

      // arrow keys or spacebar are used to move ship in setup stage
      if (selectedShip !== null && status === "setup" && (e.code === "Space" || e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === "ArrowUp" || e.code === "ArrowDown")) {
        
        // function that, given coordinate pair and ship, returns modified coordinates
        let changeFunct = (coords, ship) => [coords[0], coords[1]+1];

        if(e.code === "ArrowLeft") {
          changeFunct = (coords, ship) => [coords[0], coords[1]-1];
        }

        else if(e.code === "ArrowUp") {
          changeFunct = (coords, ship) => [coords[0]-1, coords[1]];
        }

        else if(e.code === "ArrowDown") {
          changeFunct = (coords, ship) => [coords[0]+1, coords[1]];
        }

        else if(e.code === "Space") {
          // for each square, find the difference between the row and column of the first item in the ship
          // this is the origin square everything else rotates around
          // add the row difference to the origin's column and the column difference to the origin's row
          // try rotating on different parts of the ship (changing origin) until we find one that is legal
          // try rotating ships in four different directions
          findRotation:
          for(let i=0; i<selectedShip.length; i++) {
            for(let p=0; p<=1; p++) {
              for(let q=0; q<=1; q++) {
                changeFunct = function(coords, ship){
                  let startingRow = ship[i][0];
                  let startingCol = ship[i][1];
                  let rowDiff = startingRow - coords[0];
                  let colDiff = startingCol - coords[1];
                  let newRow = p ? startingRow - colDiff : startingRow + colDiff;
                  let newCol = q ? startingCol - rowDiff : startingCol + rowDiff;
                  return [newRow, newCol];
                }
                if(legalSelectedShipMovement(changeFunct)) {
                  break findRotation;
                }
              }
            }
          }
        }

        if(legalSelectedShipMovement(changeFunct)) {
          applySelectedShipMovement(changeFunct);
        }

        e.preventDefault(); // prevent default scroll on up/down arrows
      }

      // enter key: clear selected ship
      else if (selectedShip !== null && status === "setup" && e.code === "Enter") {
        selectedShip.forEach(function(ship) {
          let id = "mysquare-" + ship[0] + "-" + ship[1];
          document.getElementById(id).style.backgroundColor = shipColor;
        });
        selectedShip = null;
      }
    }

    // if a message is received from the websocket during setup or when only one player has confirmed, call updateSetupStatus
    // if a message is received during gameplay, pass data to updateBoardAndTurn
    socket.onmessage = function(e) {
      let message = JSON.parse(JSON.parse(e.data)["message"]);
      (status === "setup" || status === "setup_confirmed") ? updateSetupStatus(message) : updateBoardAndTurn(message);
    }

    // process data from the websocket: if both players have confirmed ship placement, update status to whoever's turn it now is
    function updateSetupStatus(the_json) {
      let player1ShipStatus = the_json["player1_ship_status"];
      let player2ShipStatus = the_json["player2_ship_status"];
      let turn = the_json["turn"];
      if(player1ShipStatus === 1 && player2ShipStatus === 1) {
        turn === playerNum ? setStatus("player_turn") : setStatus("opp_turn");
      }
    }
    
    // process data from websocket
    function updateBoardAndTurn(the_json) {
      let myBoard = the_json["player_id"] === playerID;
      let shipBoard = the_json["ship_board"];
      let isHit = the_json["is_hit"];
      let isSunk = the_json["is_sunk"];
      let shotRow = the_json["shot_row"];
      let shotCol = the_json["shot_col"];
      let turn = the_json["turn"];
      let gameStatus = the_json["status"];
    
      let id = myBoard ? "mysquare-" + shotRow + "-" + shotCol : "opponentsquare-" + shotRow + "-" + shotCol;

      // if shot sunk a ship, show popup, turn square red, and play sound; after 2 seconds, hide popup and turn entire ship gray 
      if(isHit && isSunk) {
        myBoard ? popups1["setSunkPopupVisible"](true) : popups2["setSunkPopupVisible"](true);
        document.getElementById(id).style.backgroundColor = "red";
        const audio = new Audio(sunkSound);
        audio.play();
        setTimeout(function () {
          myBoard ? popups1["setSunkPopupVisible"](false) : popups2["setSunkPopupVisible"](false);
          entireShipAt(id, shipBoard).forEach((square) => document.getElementById((myBoard ? "mysquare-" : "opponentsquare-")+square[0]+"-"+square[1]).style.backgroundColor = "gray");
        }, 2000);
      }

      // if shot was hit but not sunk, show popup, turn square red, and play sound; after 2 seconds, hide popup
      else if(isHit) {
        myBoard ? popups1["setHitPopupVisible"](true) : popups2["setHitPopupVisible"](true);
        document.getElementById(id).style.backgroundColor = "red";
        const audio = new Audio(hitSound);
        audio.play();
        setTimeout(() => myBoard ? popups1["setHitPopupVisible"](false) : popups2["setHitPopupVisible"](false), 2000);
      }

      // if shot was a miss, turn square white and play miss sound
      else {
        document.getElementById(id).style.backgroundColor = "white";
        const audio = new Audio(missSound);
        audio.play();
      }

      // update status based on gameStatus and turn received from socket
      if(gameStatus > 0 && gameStatus === playerNum) {
        setStatus("player_won");
      }
      else if(gameStatus > 0 && gameStatus !== playerNum) {
        setStatus("opp_won");
      }
      else if(turn > 0 && turn === playerNum) {
        setStatus("player_turn");
      }
      else if(turn > 0 && turn !== playerNum) {
        setStatus("opp_turn");
      }
    }

    return (
      <div id="content">
        <div className="content-row">
          <div className="content-cell" style={{width: '40%'}}>YOUR BOARD</div>
          <div className="content-cell" style={{width: '20%'}}></div>
          <div className="content-cell" style={{width: '40%'}}>OPPONENT BOARD</div>
        </div>
        <div className="content-row">
          <div className="content-cell" style={{width: '40%'}}>
            <Board 
              myBoard={true} 
              status={status} 
              hitPopupVisible={popups1["hitPopupVisible"]} 
              sunkPopupVisible={popups1["sunkPopupVisible"]} />
          </div>
          <div className="content-cell" style={{width: '20%'}}>
            <Instructions status={status} /><br></br>
            <ConfirmButton status={status} setStatus={setStatus}/>
          </div>
          <div className="content-cell" style={{width: '40%'}}>
            <Board 
              myBoard={false} 
              status={status} 
              hitPopupVisible={popups2["hitPopupVisible"]}
              sunkPopupVisible={popups2["sunkPopupVisible"]} />
          </div>
        </div>
      </div>
    );
}

// text that displays the room ID in the top right corner if game is against another person
// during setup stage, extra text prompts user to give the ID to their friend to join
function RoomIDText({status}) {
  let text = "Room ID: " + gameID;
  if(status === "setup" && playerNum === 1) {
    text = "Tell your friend to join with this ID -> " + text;
  }
  return (
    <div id="gameIDText">{text}</div>
  );
}


function GamePlay() {
    ({gameID, boardSize, playerID, username, shipColor, playerNum, isAIGame} = useParams());
    const [status, setStatus] = useState("setup"); // "setup", "setup_confirmed", "player_turn", "opp_turn", "player_won", "opp_won"
    const [hitPopup1Visible, setHitPopup1Visible] = useState(false);
    const [hitPopup2Visible, setHitPopup2Visible] = useState(false);
    const [sunkPopup1Visible, setSunkPopup1Visible] = useState(false);
    const [sunkPopup2Visible, setSunkPopup2Visible] = useState(false);

    playerID = Number(playerID);
    playerNum = Number(playerNum);

    // make sure # is added onto beginning of shipColor variable (it is received in the url without it)
    if(shipColor[0] !== "#") {
      shipColor = "#" + shipColor;
    }

    // dictionary with hit/sunk popups for left side board
    let popups1 = {
      "hitPopupVisible" : hitPopup1Visible,
      "setHitPopupVisible" : setHitPopup1Visible,
      "sunkPopupVisible" : sunkPopup1Visible,
      "setSunkPopupVisible" : setSunkPopup1Visible
    }

    // dictionary with hit/sunk poups for right side board
    let popups2 = {
      "hitPopupVisible" : hitPopup2Visible,
      "setHitPopupVisible" : setHitPopup2Visible,
      "sunkPopupVisible" : sunkPopup2Visible,
      "setSunkPopupVisible" : setSunkPopup2Visible
    }

    if(socket === undefined) {
      let hostName = window.location.hostname; // allow for multiplayer locally and across computers
      socket = new WebSocket("ws://"+hostName+":8000/ws/play/"+gameID+"/");
    }

    return (
      <div>
        <HeaderAndNav username={username}/>
        {isAIGame === "false" && <RoomIDText status={status}/>}
        <BoardsAndTitles 
          status={status} 
          setStatus={setStatus}
          popups1={popups1}
          popups2={popups2}
        />
        <GameOverPopup status={status} />
      </div>
    )
}

export default GamePlay;
import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import hitImage from './images/HitPopup.png';
import sunkImage from './images/SunkPopup.png';
import hitSound from './sounds/hitSound.mp3'; 
import missSound from './sounds/missSound.mp3'; 
import sunkSound from './sounds/sunkSound.mp3';

const blankBoard = "----------------------------------------------------------------------------------------------------";
let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let playerID;
let opponentID;
let username;
let gameID;
let boardSize;
let socket;
let selectedShip; // used in ship placement phase - ex - [[0, 0], [0, 1], [0, 2], [0, 3]]

//returns a list of coordinates of the other squares that make up the ship at given coordinates
//input ex: [0, 0]
//output ex: [[0, 0], [0, 1], [0, 2], [0, 3]]
function entireShipAt(id, board) {
  let row = Number(id.slice(id.indexOf("-")+1, id.lastIndexOf("-")));
  let col = Number(id.slice(id.lastIndexOf("-")+1));
  let coords=[];
  let letter=board[(row*boardSize)+col];
  for(let r=0; r<boardSize; r++) {
    for(let c=0; c<boardSize; c++) {
      if(board[(r*boardSize)+c] == letter) {
        coords.push([r, c]);
      }
    }
  }
  return coords;
}

// changeFunct is a function that takes a length 2 array of coordinates and returns the modified coordinates
function legalSelectedShipMovement(changeFunct) {
  for(let i=0; i<selectedShip.length; i++) {
    let ship = selectedShip[i];
    let newCoords = changeFunct(ship);
    let row = newCoords[0];
    let col = newCoords[1];
    // new square out of board bounds or already contains a ship (not another part of the selected ship)
    if(row < 0 || row >= boardSize || col < 0 || col >= boardSize || (playerBoard[(row*boardSize)+col] != "-" && playerBoard[(row*boardSize)+col] != playerBoard[(ship[0]*boardSize)+ship[1]])) {
      return false;
    }
  }
  return true;
}

function applySelectedShipMovement(changeFunct) {
  let shipLetter = playerBoard[(selectedShip[0][0]*boardSize)+selectedShip[0][1]]; // letter for this ship in playerBoard (a, b, c, d)
  // first reset all old ship squares to blank
  for (let i = 0; i < selectedShip.length; i++) {
    let ship = selectedShip[i];
    let id = "mysquare-" + ship[0] + "-" + ship[1];
    document.getElementById(id).style.backgroundColor = "rgba(0, 0, 0, 0)";
    let ind = (ship[0]*boardSize)+ship[1]; // index in playerBoard
    playerBoard = playerBoard.substring(0, ind) + "-" + playerBoard.substring(ind+1);
    let newCoords = changeFunct(ship);
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

function BoardSquare({id, row, column, occupied, myBoard, isSetupStage, myTurn, gameStatus}) {
  const [hoverable, setHoverable] = useState(true);

  function handleClickSetup() {
    if(myBoard) {
      if(selectedShip != null) { // reset selected ship
        selectedShip.forEach(function(ship) {
          let id = "mysquare-" + ship[0] + "-" + ship[1];
          document.getElementById(id).style.backgroundColor = '#ff8ac7';
        })
      }
      selectedShip = null;
      if(playerBoard[(row*boardSize)+column] != "-") {
        selectedShip = entireShipAt(id, playerBoard); // set new selected ship
        selectedShip.forEach(function(ship) {
          let id = "mysquare-" + ship[0] + "-" + ship[1];
          document.getElementById(id).style.backgroundColor = "blue";
        });
      }
    }
  }

  function handleClickGameplay() {
    if(!myBoard && myTurn && gameStatus == 0 && document.getElementById(id).style.backgroundColor != "white" && document.getElementById(id).style.backgroundColor != "red") {
      setHoverable(false);
      let url = "/play/fire-shot/" + gameID + "/" + playerID + "/" + row+"/" + column;
      fetch(url);
    }
  }
  function handleMouseEnter() {
    if(!isSetupStage && !myBoard && myTurn) {
      document.getElementById(id).style.backgroundColor = "blue";
    }
  }
  function handleMouseLeave() {
    if(hoverable && !myBoard) {
      document.getElementById(id).style.backgroundColor = 'inherit';
    }
  }
  return (
    <div className="board-square" id={id}
      onClick={isSetupStage? handleClickSetup : handleClickGameplay}
      onMouseEnter = {hoverable ? handleMouseEnter : null}
      onMouseLeave = {hoverable ? handleMouseLeave : null}
      style={{backgroundColor:
           (function() {
            if(myBoard && playerBoard[(row*boardSize)+column] != "-") {
              return '#ff8ac7';
            }
            else
              return 'transparent';
            }
           )()
      }}>
    </div>
  )
}
  
function BoardRow({row, ships, myBoard, isSetupStage, myTurn, gameStatus}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      let key = (myBoard? "mysquare-" : "opponentsquare-")+row+"-"+i;
      arr.push(<BoardSquare key={key} id={key} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} gameStatus={gameStatus} />);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({myBoard, presetBoard, isSetupStage, myTurn, gameStatus, hitPopupVisible, sunkPopupVisible}) {
  let arr = [];
  for(let i=0; i<boardSize; i++) {
    let ships = presetBoard.slice((i*boardSize), ((i+1)*boardSize));
    arr.push(<BoardRow key={"row"+i} row={i} ships={ships} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} gameStatus={gameStatus} />);
  }
  return (
    <div className="board">
      {arr}
      <ComicPopup isVisible={hitPopupVisible} image={hitImage}></ComicPopup>
      <ComicPopup isVisible={sunkPopupVisible} image={sunkImage}></ComicPopup>
    </div>
  )
}
  
function Instructions({isSetupStage, myTurn}) {
    return (
      <div id="gameplay-instructions">
        {function() {
          if(isSetupStage) {
            return "Setup Stage: Click on a ship to select it, then use the Arrow Keys to move it, the Spacebar to rotate, and the Enter key to place it";
          }
          else if (myTurn) {
            return "Your Turn: Choose a square on your opponent's board to attack";
          }
          else if(!myTurn) {
            return "Waiting for opponent move...";
          }
        }()}
      </div>
    )
}

function ConfirmButton({isSetupStage, setIsSetupStage}) {
  function handleClick() {
    if(selectedShip != null) {
      selectedShip.forEach(function(ship) { // reset selectedShip
        let id = "mysquare-" + ship[0] + "-" + ship[1];
        document.getElementById(id).style.backgroundColor = '#ff8ac7';
      });
      selectedShip = null;
    }
    setIsSetupStage(false);
    let url = "/play/confirm-ships/" + gameID + "/" + playerID + "/" + playerBoard;
    fetch(url);
  }
  return (
    <div style={{width: '100%', textAlign: 'center', paddingBottom: "2%"}}>
      <button
          style={{display: isSetupStage? 'inline' : 'none'}}
          onClick={handleClick}>
        Confirm!
      </button>
    </div>
  )
}

function GameOverPopup({gameStatus}) {
  // need to actually save these, not hardcode them like this
  let numShips = 4;
  let isAiGame = "true";
  let aiID = 3;
  function redirectBrowser(the_json){
    gameID = the_json["game_id"];
    window.location.replace("/game/"+gameID+"/"+boardSize+"/"+aiID+"/"+playerID+"/"+username);
}
  function handleButtonClick() {
    let url = "/play/new-game/" + playerID + "/" + aiID + "/" + numShips + "/" + boardSize + "/" + isAiGame;
    fetch(url)
      .then( response => response.json() )
      .then( the_json => redirectBrowser(the_json));
  }
  return (
    <div id="gameOverPopup" style={{visibility: (gameStatus > 0) ? 'visible' : 'hidden'}}>
      <div>GAME OVER</div>
      <div>{(gameStatus == 1) ? "You Won!" : "Opponent Won :("}</div><br></br>
      <button onClick={handleButtonClick}>Play Again</button>
    </div>
  )
}

function ComicPopup({isVisible, image}) {
  return (
    <div style={{
      width: '120%',
      display: (isVisible == true) ? 'block' : 'none',
      position: 'absolute',
      top: '5%',
      left: '-10%'
      }}>
      <img style={{width: '100%'}} src={image}></img>
    </div>
  )
}

function BoardsAndTitles({gameStatus, setGameStatus, isSetupStage, setIsSetupStage, myTurn, setMyTurn, popups1, popups2}) {

    useEffect(() => {
      if (isSetupStage && selectedShip !== null) {
        document.addEventListener('keydown', handleKeys);
      }

      return () => {
        if (isSetupStage && selectedShip !== null) {
          document.removeEventListener('keydown', handleKeys);
        }
      };
    }, [isSetupStage, selectedShip]);

    function handleKeys(e) {

      // arrow keys or spacebar to move ship in setup stage
      if (selectedShip != null && isSetupStage && (e.code == "Space" || e.code == "ArrowRight" || e.code == "ArrowLeft" || e.code == "ArrowUp" || e.code == "ArrowDown")) {
        let changeFunct = (coords) => [coords[0], coords[1]+1]; // function that returns new coordinates
        if(e.code == "ArrowLeft") {
          changeFunct = (coords) => [coords[0], coords[1]-1];
        }
        else if(e.code == "ArrowUp") {
          changeFunct = (coords) => [coords[0]-1, coords[1]];
        }
        else if(e.code == "ArrowDown") {
          changeFunct = (coords) => [coords[0]+1, coords[1]];
        }
        else if(e.code == "Space") {
          // for each square, find the difference between the row and column of the first item in the ship
          // this is the origin square everything else rotates around
          // add the row difference to the origin's column and the column difference to the origin's row
          changeFunct = function(coords){
            let startingRow = selectedShip[0][0];
            let startingCol = selectedShip[0][1];
            let rowDiff = selectedShip[0][0] - coords[0];
            let colDiff = selectedShip[0][1] - coords[1];
            return [startingRow+colDiff, startingCol+rowDiff];
          }
        }
        if(legalSelectedShipMovement(changeFunct)) {
          applySelectedShipMovement(changeFunct);
        }
        e.preventDefault(); // prevent default scroll on up/down arrows
      }
      else if (selectedShip != null && isSetupStage && e.code == "Enter") { // enter key: reset selected ship
        selectedShip.forEach(function(ship) {
          let id = "mysquare-" + ship[0] + "-" + ship[1];
          document.getElementById(id).style.backgroundColor = '#ff8ac7';
        });
        selectedShip = null;
      }
    }

    socket.onmessage = function(e) {
      let message = JSON.parse(JSON.parse(e.data)["message"]);
      updateBoardAndTurn(message);
    }
    
    function updateBoardAndTurn(the_json) {
      let myBoard = the_json["player_id"] == playerID;
      let shipBoard = the_json["ship_board"];
      let attackBoard = the_json["attack_board"];
      let combinedBoard = the_json["combined_board"];
      let isHit = the_json["is_hit"];
      let isSunk = the_json["is_sunk"];
      let shotRow = the_json["shot_row"];
      let shotCol = the_json["shot_col"];
      let turn = the_json["turn"];
      let status = the_json["status"];
    
      let id = myBoard ? "mysquare-"+shotRow+"-"+shotCol : "opponentsquare-"+shotRow+"-"+shotCol;
      if(isHit && isSunk) {
        myBoard ? popups1["setSunkPopupVisible"](true) : popups2["setSunkPopupVisible"](true);
        document.getElementById(id).style.backgroundColor = "red";
        const audio = new Audio(sunkSound);
        audio.play();
        setGameStatus(status);
        setMyTurn(turn === 1);
        setTimeout(function () {
          myBoard ? popups1["setSunkPopupVisible"](false) : popups2["setSunkPopupVisible"](false);
          entireShipAt(id, shipBoard).forEach((square) => document.getElementById((myBoard ? "mysquare-" : "opponentsquare-")+square[0]+"-"+square[1]).style.backgroundColor = "gray");
        }, 2000);
      }
      else if(isHit) {
        myBoard ? popups1["setHitPopupVisible"](true) : popups2["setHitPopupVisible"](true);
        document.getElementById(id).style.backgroundColor = "red";
        const audio = new Audio(hitSound);
        audio.play();
        setGameStatus(status);
        setMyTurn(turn === 1);
        setTimeout(() => myBoard ? popups1["setHitPopupVisible"](false) : popups2["setHitPopupVisible"](false), 2000);
      }
      else {
        document.getElementById(id).style.backgroundColor = "white";
        const audio = new Audio(missSound);
        audio.play();
        setGameStatus(status);
        setMyTurn(turn === 1);
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
              presetBoard={playerBoard} 
              isSetupStage={isSetupStage} 
              myTurn={myTurn} 
              gameStatus={gameStatus} 
              hitPopupVisible={popups1["hitPopupVisible"]} 
              sunkPopupVisible={popups1["sunkPopupVisible"]} />
          </div>
          <div className="content-cell" style={{width: '20%'}}>
            <Instructions isSetupStage={isSetupStage} myTurn={myTurn}/><br></br>
            <ConfirmButton isSetupStage={isSetupStage} setIsSetupStage={setIsSetupStage}></ConfirmButton>
          </div>
          <div className="content-cell" style={{width: '40%'}}>
            <Board 
              myBoard={false} 
              presetBoard={blankBoard} 
              isSetupStage={isSetupStage} 
              myTurn={myTurn} 
              gameStatus={gameStatus} 
              hitPopupVisible={popups2["hitPopupVisible"]}
              sunkPopupVisible={popups2["sunkPopupVisible"]} />
          </div>
        </div>
      </div>
    );
}
  
function GamePlay() {
    ({gameID, boardSize, opponentID, playerID, username} = useParams());
    const [gameStatus, setGameStatus] = useState(0);
    const [isSetupStage, setIsSetupStage] = useState(true);
    const [myTurn, setMyTurn] = useState(true);
    const [hitPopup1Visible, setHitPopup1Visible] = useState(false);
    const [hitPopup2Visible, setHitPopup2Visible] = useState(false);
    const [sunkPopup1Visible, setSunkPopup1Visible] = useState(false);
    const [sunkPopup2Visible, setSunkPopup2Visible] = useState(false);
    const [selectedShip, setSelectedShip] = useState(null);

    let popups1 = {
      "hitPopupVisible" : hitPopup1Visible,
      "setHitPopupVisible" : setHitPopup1Visible,
      "sunkPopupVisible" : sunkPopup1Visible,
      "setSunkPopupVisible" : setSunkPopup1Visible
    }

    let popups2 = {
      "hitPopupVisible" : hitPopup2Visible,
      "setHitPopupVisible" : setHitPopup2Visible,
      "sunkPopupVisible" : sunkPopup2Visible,
      "setSunkPopupVisible" : setSunkPopup2Visible
    }

    if(socket == undefined) {
      socket = new WebSocket("ws://localhost:8000/ws/play/"+gameID+"/");
    }

    return (
      <div>
        <HeaderAndNav username={username}/>
        <BoardsAndTitles 
          gameStatus={gameStatus} 
          setGameStatus={setGameStatus}
          isSetupStage={isSetupStage}
          setIsSetupStage={setIsSetupStage}
          myTurn={myTurn}
          setMyTurn={setMyTurn}
          popups1={popups1}
          popups2={popups2}
        />
        <GameOverPopup gameStatus={gameStatus} />
      </div>
    )
}

export default GamePlay;
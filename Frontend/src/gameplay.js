import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import hitImage from './images/HitPopup.png';
import sunkImage from './images/SunkPopup.png';
import hitSound from './sounds/hitSound.mp3'; 
import missSound from './sounds/missSound.mp3'; 
import sunkSound from './sounds/sunkSound.mp3'; 

let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let playerID;
let opponentID;
let username;
let gameID;
let boardSize;
const blankBoard = "----------------------------------------------------------------------------------------------------";

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

function updateBoardAndTurn(the_json, myBoard, setGameStatus, myTurn, setMyTurn, setHitPopupVisible, setSunkPopupVisible) {
  let shipBoard = the_json["ship_board"];
  let attackBoard = the_json["attack_board"];
  let combinedBoard = the_json["combined_board"];
  let isHit = the_json["is_hit"];
  let isSunk = the_json["is_sunk"];
  let shotRow = the_json["shot_row"];
  let shotCol = the_json["shot_col"];
  let turn = the_json["turn"];
  let status = the_json["status"];


  if(shotRow != -1 && shotCol != -1 && (turn == 0) != myTurn) { // game has started and this turn just happened
    let id = myBoard ? "mysquare-"+shotRow+"-"+shotCol : "opponentsquare-"+shotRow+"-"+shotCol;
    if(isHit && isSunk) {
      setSunkPopupVisible(true);
      document.getElementById(id).style.backgroundColor = "red";
      setTimeout(() => setSunkPopupVisible(false), 2000);
      entireShipAt(id, shipBoard).forEach((square) => document.getElementById((myBoard ? "mysquare-" : "opponentsquare-")+square[0]+"-"+square[1]).style.backgroundColor = "gray");
      const audio = new Audio(sunkSound);
      audio.play();
    }
    else if(isHit) {
      setHitPopupVisible(true);
      document.getElementById(id).style.backgroundColor = "red";
      setTimeout(() => setHitPopupVisible(false), 2000)
      const audio = new Audio(hitSound);
      audio.play();
    }
    else {
      document.getElementById(id).style.backgroundColor = "white";
      const audio = new Audio(missSound);
      audio.play();
    }
    setGameStatus(status);
    setMyTurn(turn == 1 ? true : false);
  }
}

function fetchUpdateFromOpponent({myTurn, setMyTurn, setGameStatus, setHitPopupVisible, setSunkPopupVisible}) {
  let url = "/play/get-state/"+gameID+"/"+playerID;
  fetch(url)
    .then( response => response.json())
    .then( the_json => updateBoardAndTurn(the_json, true, setGameStatus, myTurn, setMyTurn, setHitPopupVisible, setSunkPopupVisible) )
    .then(setTimeout(() => fetchUpdateFromOpponent({myTurn, setMyTurn, setGameStatus, setHitPopupVisible, setSunkPopupVisible}), 2000));
}

function BoardSquare({id, row, column, occupied, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus, setHitPopupVisible, setSunkPopupVisible}) {
  const myShip = occupied;
  const [hoverable, setHoverable] = useState(true);
  function handleClickSetup() {
    if(myBoard) {
      
    }
  }
  function handleClickGameplay() {
    if(!myBoard && myTurn && gameStatus == 0 && document.getElementById(id).style.backgroundColor != "white" && document.getElementById(id).style.backgroundColor != "red") {
      setHoverable(false);
      let url = "/play/fire-shot/" + gameID + "/" + playerID + "/" + row+"/" + column;
      let url2 = "/play/get-state/"+gameID+"/"+opponentID;
      fetch(url)
        .then(function() {
          fetch(url2)
            .then(response => response.json())
            .then(the_json => updateBoardAndTurn(the_json, false, setGameStatus, myTurn, setMyTurn, setHitPopupVisible, setSunkPopupVisible));
        })
    }
  }
  function handleMouseEnter() {
    if(myBoard && myShip && isSetupStage) {
      entireShipAt(id, playerBoard).forEach((square) => document.getElementById("mysquare-"+square[0]+"-"+square[1]).style.backgroundColor = "pink");
    }
    if(!isSetupStage && !myBoard && myTurn) {
      document.getElementById(id).style.backgroundColor = "blue";
    }
  }
  function handleMouseLeave() {
    if(myBoard && myShip && isSetupStage) {
      document.getElementById(id).style.backgroundColor = '#ff8ac7';
    }
    else if(hoverable && !myBoard) {
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
            if(myBoard && myShip) {
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
  
function BoardRow({row, ships, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus, setHitPopupVisible, setSunkPopupVisible}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      let key = (myBoard? "mysquare-" : "opponentsquare-")+row+"-"+i;
      arr.push(<BoardSquare key={key} id={key} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus} setHitPopupVisible={setHitPopupVisible} setSunkPopupVisible={setSunkPopupVisible}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({presetBoard=blankBoard, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus}) {
    const [hitPopupVisible, setHitPopupVisible] = useState(false);
    const [sunkPopupVisible, setSunkPopupVisible] = useState(false);
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      let ships = presetBoard.slice((i*boardSize), ((i+1)*boardSize));
      arr.push(<BoardRow key={"row"+i} row={i} ships={ships} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus} setHitPopupVisible={setHitPopupVisible} setSunkPopupVisible={setSunkPopupVisible}/>);
    }
    if(myBoard) {
      setTimeout(() => fetchUpdateFromOpponent({myTurn, setMyTurn, setGameStatus, setHitPopupVisible, setSunkPopupVisible}), 2000);
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
            return "Setup Stage: Click on 'Confirm' to confirm your ship configuration (ship placement feature coming)";
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
  
function GamePlay() {
    ({gameID, boardSize, opponentID, playerID, username} = useParams());
    //pass the following states around so components know when they update
    const [isSetupStage, setIsSetupStage] = useState(true);
    const [myTurn, setMyTurn] = useState(true);
    const [gameStatus, setGameStatus] = useState(0);

    return (
      <div>
        <HeaderAndNav username={username}/>
        <div id="content">
          <div className="content-row">
            <div className="content-cell" style={{width: '40%'}}>YOUR BOARD</div>
            <div className="content-cell" style={{width: '20%'}}></div>
            <div className="content-cell" style={{width: '40%'}}>OPPONENT BOARD</div>
          </div>
          <div className="content-row">
            <div className="content-cell" style={{width: '40%'}}>
              <Board presetBoard={playerBoard} myBoard={true} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>
            </div>
            <div className="content-cell" style={{width: '20%'}}>
              <Instructions isSetupStage={isSetupStage} myTurn={myTurn}/><br></br>
              <ConfirmButton isSetupStage={isSetupStage} setIsSetupStage={setIsSetupStage}></ConfirmButton>
            </div>
            <div className="content-cell" style={{width: '40%'}}>
              <Board myBoard={false} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>
            </div>
          </div>
        </div>
        <GameOverPopup gameStatus={gameStatus}></GameOverPopup>
      </div>
    )
}

export default GamePlay

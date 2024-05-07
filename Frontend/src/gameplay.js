import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let opponentBoard = "----------------------------------------------------------------------------------------------------";
let playerID;
let gameID;

// returns true/false whether it is player turn or not
function updatePlayerBoardAndTurn(the_json, setGameStatus) {
  let attackBoard = the_json["attack_board"];
  let shipBoard = the_json["ship_board"];
  let turn = the_json["turn"];
  let status = the_json["status"];
  let is_hit = the_json["is_hit"];
  let shot_row = the_json["shot_row"];
  let shot_col = the_json["shot_col"];

  if(shot_row != -1 && shot_col != -1) { // game has started
    let id = "my-"+"square-"+shot_row+"-"+shot_col;
    if(is_hit) {
      document.getElementById(id).style.backgroundColor = "red";
    }
    else {
      document.getElementById(id).style.backgroundColor = "white";
    }

    setGameStatus(status);
  }
  return turn == 1 ? true : false;
}

function fetchUpdate({myTurn, setMyTurn, setGameStatus}) {
  let isMyBoard = "true";
  let url = "/play/get-state/"+gameID+"/"+playerID+"/"+isMyBoard;
  fetch(url)
    .then( response => response.json())
    .then( the_json => setMyTurn(updatePlayerBoardAndTurn(the_json, setGameStatus)) )
    .then(setTimeout(() => fetchUpdate({myTurn, setMyTurn, setGameStatus}), 2000));
}

function BoardSquare({id, row, column, occupied, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus}) {
  const myShip = occupied;
  const [isHovered, setIsHovered] = useState(false);
  function applyPlayerMoveUpdate(the_json) {
    let isHit = the_json["is_hit"];
    let attackBoard = the_json["attack_board"];
    let turn = the_json["turn"];
    let status = the_json["status"];

    if(isHit) {
      document.getElementById(id).style.backgroundColor = "red";
    }
    else {
      document.getElementById(id).style.backgroundColor = "white";
    }

    setMyTurn(turn == 1);
  }
  function handleClickSetup() {
    if(myBoard) {
      return;
    }
  }
  function handleClickGameplay() {
    if(!myBoard && myTurn && gameStatus == 0) {
      let url = "/play/fire-shot/" + gameID + "/" + playerID + "/" + row+"/" + column;
      fetch(url)
        .then( response => response.json() )
        .then( the_json => applyPlayerMoveUpdate(the_json) )
        .then(fetchUpdate({myTurn, setMyTurn, setGameStatus}));
    }
  }
  return (
    <div className="board-square" id={id}
      onClick={isSetupStage? handleClickSetup : handleClickGameplay}
      onMouseEnter = {() => setIsHovered(true)}
      onMouseLeave = {() => setIsHovered(false)}
      style={{backgroundColor:
           (function() {
            if(myBoard && myShip) {
              if(isHovered && isSetupStage) {
                return 'pink';
              }
              else {
                return '#ff8ac7';
              }
            }
           })()
      }}>
    </div>
  )
}
  
function BoardRow({row, boardSize, ships, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      let key = (myBoard? "my-" : "opponent-")+"square-"+row+"-"+i;
      arr.push(<BoardSquare key={key} id={key} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({boardSize, presetBoard, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardRow key={"row"+i} row={i} boardSize={10} ships={presetBoard.slice((i*boardSize), ((i+1)*boardSize))} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>);
    }
    return (
      <div className="board">{arr}</div>
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
    <div style={{width: '100%', textAlign: 'center'}}>
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
  let boardSize = 10;
  let isAiGame = "true";
  let aiID = 3;
  function redirectBrowser(the_json){
    gameID = the_json["game_id"];
    window.location.replace("/game/"+playerID+"/"+gameID+"/"+boardSize);
}
  function handleButtonClick() {
    let url = "/play/new-game/" + playerID + "/" + aiID + "/" + numShips + "/" + boardSize + "/" + isAiGame;
    fetch(url).then( response => response.json() ).then( the_json => redirectBrowser(the_json)); // Matt
  }
  return (
    <div style={{
      backgroundColor: '#ff8ac7',
      color: 'white',
      fontSize: '200%',
      position: 'fixed',
      width: '40%',
      left: '27%',
      top: '30%',
      border: '2px solid white',
      borderRadius: '20px',
      padding: '3%',
      textAlign: 'center',
      visibility: (gameStatus > 0) ? 'visible' : 'hidden'
    }}>
      <div>GAME OVER</div>
      <div>{(gameStatus == 1) ? "You Won!" : "Opponent Won :("}</div><br></br>
      <button onClick={handleButtonClick}>Play Again</button>
    </div>
  )
}
  
function GamePlay() {
    let boardSize;
    ({gameID, playerID, boardSize} = useParams());
    //pass these states around so components know when they update; they must be states and not variables so components automatically update
    const [isSetupStage, setIsSetupStage] = useState(true);
    const [myTurn, setMyTurn] = useState(true);
    const [gameStatus, setGameStatus] = useState(0);
    setTimeout(() => fetchUpdate({myTurn, setMyTurn, setGameStatus}), 2000)
    return (
      <div>
        <HeaderAndNav playerID={playerID}/>
        <Instructions isSetupStage={isSetupStage} myTurn={myTurn}/>
        <ConfirmButton isSetupStage={isSetupStage} setIsSetupStage={setIsSetupStage}></ConfirmButton>
        <div id="content">
          <div className="content-row">
            <div className="content-cell">YOUR BOARD</div>
            <div className="content-cell">OPPONENT BOARD</div>
          </div>
          <div className="content-row" id="board-row">
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={playerBoard} myBoard={true} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>
            </div>
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={opponentBoard} myBoard={false} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>
            </div>
          </div>
        </div>
        <GameOverPopup gameStatus={gameStatus}></GameOverPopup>
      </div>
    )
}

export default GamePlay

import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import hitImage from './images/HitPopup.png';
import sunkImage from './images/SunkPopup.png';

let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let opponentBoard = "----------------------------------------------------------------------------------------------------";
let playerID;
let gameID;

// returns true/false whether it is player turn or not
function updatePlayerBoardAndTurn(the_json, setGameStatus, setHitPopupVisible, setSunkPopupVisible) {
  let attackBoard = the_json["attack_board"];
  let shipBoard = the_json["ship_board"];
  let turn = the_json["turn"];
  let status = the_json["status"];
  let is_hit = the_json["is_hit"];
  let shot_row = the_json["shot_row"];
  let shot_col = the_json["shot_col"];
  let isSunk = the_json["is_sunk"];

  if(shot_row != -1 && shot_col != -1) { // game has started
    let id = "my-"+"square-"+shot_row+"-"+shot_col;
    if(is_hit) {
      //setHitPopupVisible(true);
      document.getElementById(id).style.backgroundColor = "red";
      //setTimeout(() => setHitPopupVisible(false), 2000);
    }
    else {
      document.getElementById(id).style.backgroundColor = "white";
    }

    setGameStatus(status);
  }
  return turn == 1 ? true : false;
}

function fetchUpdate({myTurn, setMyTurn, setGameStatus, setHitPopupVisible}) {
  let isMyBoard = "true";
  let url = "/play/get-state/"+gameID+"/"+playerID+"/"+isMyBoard;
  fetch(url)
    .then( response => response.json())
    .then( the_json => setMyTurn(updatePlayerBoardAndTurn(the_json, setGameStatus, setHitPopupVisible)) )
    .then(setTimeout(() => fetchUpdate({myTurn, setMyTurn, setGameStatus, setHitPopupVisible}), 2000));
}

function BoardSquare({id, row, column, occupied, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus, setHitPopupVisible, setSunkPopupVisible}) {
  const myShip = occupied;
  const [isHovered, setIsHovered] = useState(false);
  function applyPlayerMoveUpdate(the_json) {
    let isHit = the_json["is_hit"];
    let attackBoard = the_json["attack_board"];
    let turn = the_json["turn"];
    let status = the_json["status"];
    let isSunk = the_json["is_sunk"];

    if(isSunk && isHit) {
      setSunkPopupVisible(true);
      document.getElementById(id).style.backgroundColor = "red";
      setTimeout(() => setSunkPopupVisible(false), 2000);
    }
    else if(isHit) {
      setHitPopupVisible(true);
      document.getElementById(id).style.backgroundColor = "red";
      setTimeout(() => setHitPopupVisible(false), 2000);
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
    if(!myBoard && myTurn && gameStatus == 0 && document.getElementById(id).style.backgroundColor != "white" && document.getElementById(id).style.backgroundColor != "red") {
      let url = "/play/fire-shot/" + gameID + "/" + playerID + "/" + row+"/" + column;
      fetch(url)
        .then( response => response.json() )
        .then( the_json => applyPlayerMoveUpdate(the_json) )
        .then(fetchUpdate({myTurn, setMyTurn, setGameStatus, setHitPopupVisible}));
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
            else if(isSetupStage || myBoard) {
              return 'transparent';
            }
           })()
      }}>
    </div>
  )
}
  
function BoardRow({row, boardSize, ships, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus, setHitPopupVisible, setSunkPopupVisible}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      let key = (myBoard? "my-" : "opponent-")+"square-"+row+"-"+i;
      arr.push(<BoardSquare key={key} id={key} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus} setHitPopupVisible={setHitPopupVisible} setSunkPopupVisible={setSunkPopupVisible}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({boardSize, presetBoard, myBoard, isSetupStage, myTurn, setMyTurn, gameStatus, setGameStatus}) {
    const [hitPopupVisible, setHitPopupVisible] = useState(false);
    const [sunkPopupVisible, setSunkPopupVisible] = useState(false);
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardRow key={"row"+i} row={i} boardSize={10} ships={presetBoard.slice((i*boardSize), ((i+1)*boardSize))} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus} setHitPopupVisible={setHitPopupVisible} setSunkPopupVisible={setSunkPopupVisible}/>);
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
      backgroundColor: 'white',
      color: 'black',
      fontSize: '200%',
      position: 'fixed',
      width: '40%',
      left: '27%',
      top: '30%',
      border: '5px solid black',
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

function ComicPopup({isVisible, image}) {
  return (
    <div style={{
      width: '120%',
      display: (isVisible == true) ? 'block' : 'none',
      position: 'absolute',
      top: '5%',
      left: '-10%'
      }}>
      <img style={{width: '100%'}} src={image} alt="Hit!"></img>
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
        <div id="content">
          <div className="content-row">
            <div className="content-cell" style={{width: '40%'}}>YOUR BOARD</div>
            <div className="content-cell" style={{width: '20%'}}></div>
            <div className="content-cell" style={{width: '40%'}}>OPPONENT BOARD</div>
          </div>
          <div className="content-row" id="board-row">
            <div className="content-cell" style={{width: '40%'}}>
              <Board boardSize={boardSize} presetBoard={playerBoard} myBoard={true} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>
            </div>
            <div className="content-cell" style={{width: '20%'}}>
              <Instructions isSetupStage={isSetupStage} myTurn={myTurn}/><br></br>
              <ConfirmButton isSetupStage={isSetupStage} setIsSetupStage={setIsSetupStage}></ConfirmButton>
            </div>
            <div className="content-cell" style={{width: '40%'}}>
              <Board boardSize={boardSize} presetBoard={opponentBoard} myBoard={false} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>
            </div>
          </div>
        </div>
        <GameOverPopup gameStatus={gameStatus}></GameOverPopup>
      </div>
    )
}

export default GamePlay

import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

let shipSizes = [5, 4, 3, 3, 2];
let boardSize = 10;
let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let opponentBoard = "----------------------------------------------------------------------------------------------------";
let playerID;
let gameID;

// returns updated myTurn var
function updatePlayerBoardAndTurn(the_json, myTurn) {
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

    if(status == 1) {
      alert("Game over; you won!");
    }
    else if(status == 2) {
      alert("Game over; opponent won :(");
    }
  }
  return turn == 1 ? true : false;
}

function fetchUpdate({myTurn, setMyTurn}) {
  let isMyBoard = "true";
  let url = "/play/get-state/"+gameID+"/"+playerID+"/"+isMyBoard;
  fetch(url)
    .then( response => response.json())
    .then( the_json => setMyTurn(updatePlayerBoardAndTurn(the_json, myTurn)) )
    .then(setTimeout(() => fetchUpdate({myTurn, setMyTurn}), 2000));
}

function BoardSquare({id, row, column, occupied, myBoard, isSetupStage, myTurn, setMyTurn}) {
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
    if(!myBoard && myTurn) {
      let url = "/play/fire-shot/" + gameID + "/" + playerID + "/" + row+"/" + column;
      fetch(url)
        .then( response => response.json() )
        .then( the_json => applyPlayerMoveUpdate(the_json) )
        .then(fetchUpdate({myTurn, setMyTurn}));
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
  
function BoardRow({row, boardSize, ships, myBoard, isSetupStage, myTurn, setMyTurn}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      let key = (myBoard? "my-" : "opponent-")+"square-"+row+"-"+i;
      arr.push(<BoardSquare key={key} id={key} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({boardSize, presetBoard, myBoard, isSetupStage, myTurn, setMyTurn}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardRow key={"row"+i} row={i} boardSize={10} ships={presetBoard.slice((i*boardSize), ((i+1)*boardSize))} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn}/>);
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
  
function GamePlay() {
    ({gameID, playerID} = useParams());
    //pass these states around so components know when they update; they must be states and not variables so components automatically update
    const [isSetupStage, setIsSetupStage] = useState(true);
    const [myTurn, setMyTurn] = useState(true);
    setTimeout(() => fetchUpdate({myTurn, setMyTurn}), 2000)
    return (
      <div>
        <HeaderAndNav playerID={playerID}/>
        <div id="content">
          <div className="content-row">
            <div className="content-cell">YOUR BOARD</div>
            <div className="content-cell">OPPONENT BOARD</div>
          </div>
          <div className="content-row" id="board-row">
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={playerBoard} myBoard={true} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn}/>
            </div>
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={opponentBoard} myBoard={false} isSetupStage={isSetupStage} myTurn={myTurn} setMyTurn={setMyTurn}/>
            </div>
          </div>
        </div>
        <Instructions isSetupStage={isSetupStage} myTurn={myTurn}/>
        <ConfirmButton isSetupStage={isSetupStage} setIsSetupStage={setIsSetupStage}></ConfirmButton>
      </div>
    )
}

export default GamePlay

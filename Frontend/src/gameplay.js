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

  if(myTurn && turn == 2) {
    return false;
  }
  if(!myTurn && turn == 1) {
    return true;
  }
  if(status == 1) {
    alert("Game over; you won!");
  }
  else if(status == 2) {
    alert("Game over; opponent won :(");
  }
  return myTurn;
}

function updateOpponentBoardAndTurn(the_json, myTurn) {
  let attackBoard = the_json["attack_board"];
  let turn = the_json["turn"];
  let status = the_json["status"];
  let is_hit = the_json["is_hit"];
  let shot_row = the_json["shot_row"];
  let shot_col = the_json["shot_col"];

  if(myTurn && turn == 2) {
    return false;
  }
  if(!myTurn && turn == 1) {
    return true;
  }
  if(status == 1) {
    alert("Game over; you won!");
  }
  else if(status == 2) {
    alert("Game over; opponent won :(");
  }
  return myTurn;
}

function fetchUpdate({myTurn, setMyTurn}) {
  let isMyBoard = "true";
  let url = "http://web:8000/get-state/"+gameID+"/"+playerID+"/"+isMyBoard;
  fetch(URL).then( response => response.json()).then( the_json => setMyTurn(updatePlayerBoardAndTurn(the_json, myTurn)) ); // add this back in
  isMyBoard = "false";
  url = "http://web:8000/get-state/"+gameID+"/"+playerID+"/"+isMyBoard;
  fetch(URL).then( response => response.json()).then( the_json => setMyTurn(updateOpponentBoardAndTurn(the_json, myTurn)) ); // add this back in
}

function BoardSquare({row, column, occupied, myBoard, isSetupStage, myTurn}) {
  const [isOccupied, setIsOccupied] = useState(occupied === true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMyBoard = myBoard;
  function applyUpdate(the_json) {
    let isHit = the_json["is_hit"];
    let attackBoard = the_json["attack_board"];
    let turn = the_json["turn"];
    let status = the_json["status"];
    
    setIsOccupied(isHit == 1);
    setIsEmpty(isHit == 0);
    if(status == 1) {
      alert("Game over; you won!");
    }
    else if(status == 2) {
      alert("Game over; opponent won :(");
    }
  }
  function handleClickSetup() {
    if(isMyBoard) {
      return;
    }
  }
  function handleClickGameplay() {
    if(!isMyBoard && myTurn) {
      //applyUpdate({'result': Math.floor(Math.random()*2)}) //randomly chooses hit or miss // remove this
      let url = "http://web:8000/fire-shot/" + gameID + "/" + playerID + "/" + row+"/" + column;
      alert("fetching URL: " + url);
      fetch(URL).then( response => response.json() ).then( the_json => applyUpdate(the_json) ); // Matt // add this back in
    }
  }
  return (
    <div className="board-square"
      onClick={isSetupStage? handleClickSetup : handleClickGameplay}
      onMouseEnter = {() => setIsHovered(true)}
      onMouseLeave = {() => setIsHovered(false)}
      style={{backgroundColor:
           (function() {
            if(isMyBoard) {
              if(isOccupied && isHovered && isSetupStage) {
                return 'pink';
              }
              if(isOccupied) {
                return '#ff8ac7';
              }
              if(!isOccupied && isEmpty) {
                return 'white';
              }
              return 'inherit';
            }
            else {
              if(isOccupied) {
                return 'red';
              }
              if(isEmpty) {
                return 'white';
              }
              if(!isOccupied && !isEmpty && !isSetupStage && isHovered && myTurn) {
                return 'blue';
              }
              return 'inherit';
            }
           })()
      }}>
    </div>
  )
}
  
function BoardRow({row, boardSize, ships, myBoard, isSetupStage, myTurn}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardSquare key={"square"+{row}+"-"+i} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({boardSize, presetBoard, myBoard, isSetupStage, myTurn}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardRow key={"row"+i} row={i} boardSize={10} ships={presetBoard.slice((i*boardSize), ((i+1)*boardSize))} myBoard={myBoard} isSetupStage={isSetupStage} myTurn={myTurn}/>);
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
    let url = "http://web:8000/confirm-ships/" + gameID + "/" + playerID + "/" + playerBoard;
    alert("fetching URL: "+url);
    fetch(url); // add this back in
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
    setInterval(() => fetchUpdate({myTurn, setMyTurn}), 5000)
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
              <Board boardSize={boardSize} presetBoard={playerBoard} myBoard={true} isSetupStage={isSetupStage} myTurn={myTurn}/>
            </div>
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={opponentBoard} myBoard={false} isSetupStage={isSetupStage} myTurn={myTurn}/>
            </div>
          </div>
        </div>
      </div>
    )
}

export default GamePlay

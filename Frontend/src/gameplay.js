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

function BoardSquare({row, column, occupied, myBoard, isSetupStage}) {
  const [isOccupied, setIsOccupied] = useState(occupied === true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMyBoard = myBoard;
  function applyUpdate(the_json) {
    alert("results are "+the_json);
    let result = the_json["result"]; // TODO change this
    setIsOccupied(result == 1);
    setIsEmpty(result == 0);
  }
  function handleClickSetup() {
    if(isMyBoard) {
      return;
    }
  }
  function handleClickGameplay() {
    if(!isMyBoard) {
      applyUpdate({'result': Math.floor(Math.random()*2)}) //randomly chooses hit or miss - TODO remove this
      URL = "/fire-shot/"+gameID+"/"+playerID+"/<attackboard>/" + row + "/" + column;
      alert("fetching URL: "+URL);
      //fetch(URL).then( response => response.json()).then( the_json => applyUpdate(the_json) ); // Matt
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
              if(isOccupied && (!isHovered || !isSetupStage)) {
                return '#ff8ac7';
              }
              if(isOccupied && isHovered && isSetupStage) {
                return 'pink';
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
              if(!isOccupied && !isEmpty && isHovered) {
                return 'blue';
              }
              return 'inherit';
            }
           })()
      }}>
    </div>
  )
}
  
function BoardRow({row, boardSize, ships, myBoard, isSetupStage}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardSquare key={"square"+{row}+"-"+i} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({boardSize, presetBoard, myBoard, isSetupStage}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardRow key={"row"+i} row={i} boardSize={10} ships={presetBoard.slice((i*boardSize), ((i+1)*boardSize))} myBoard={myBoard}/>);
    }
    return (
      <div className="board">{arr}</div>
    )
}
  
function Instructions({isSetupStage}) {
    return (
      <div id="gameplay-instructions">
        {function() {
          if(isSetupStage) {
            return "Setup Stage: Click on 'Confirm' to confirm your ship configuration (ship placement feature coming)";
          }
          else {
            return "Your Turn: Choose a square on your opponent's board to attack";
          }
        }()}
      </div>
    )
}

function ConfirmButton({isSetupStage, setIsSetupStage}) {
  function handleClick() {
    setIsSetupStage(false);
    URL = "/confirm-ships/"+gameID+"/"+playerID+"/"+playerBoard;
    alert("fetching URL: "+URL);
    fetch(URL);
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
    const [isSetupStage, setIsSetupStage] = useState(true); //pass this state around so components know when it updates
    return (
      <div>
        <HeaderAndNav playerID={playerID}/>
        <Instructions isSetupStage={isSetupStage}/>
        <ConfirmButton isSetupStage={isSetupStage} setIsSetupStage={setIsSetupStage}></ConfirmButton>
        <div id="content">
          <div className="content-row">
            <div className="content-cell">YOUR BOARD</div>
            <div className="content-cell">OPPONENT BOARD</div>
          </div>
          <div className="content-row" id="board-row">
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={playerBoard} myBoard={true} isSetupStage={isSetupStage}/>
            </div>
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={opponentBoard} myBoard={false} isSetupStage={isSetupStage}/>
            </div>
          </div>
        </div>
      </div>
    )
}

export default GamePlay
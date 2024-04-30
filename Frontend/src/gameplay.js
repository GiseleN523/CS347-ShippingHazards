import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

let isPlacementStage = true;
let shipSizes = [5, 4, 3, 3, 2];
let boardSize = 10;
let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let opponentBoard = "----------------------------------------------------------------------------------------------------";
let playerID;
let gameID;

function BoardSquare({row, column, occupied, myBoard}) {
  const [isOccupied, setIsOccupied] = useState(occupied == true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMyBoard = myBoard;
  function applyUpdate(the_json) {
    //alert("results are "+the_json);
    setIsOccupied(isOccupied);
    setIsEmpty(false);
  }
  function handleClickPlacement() {
    if(isMyBoard) {
      return;
    }
  }
  function handleClickGameplay() {
    if(!isMyBoard) {
      URL = "/fireshot/<gameID>/<playerID>/<attackboard>/" + row + "/" + column;
      alert("fetching URL "+URL);
      fetch(URL).then( response => response.json()).then( the_json => applyUpdate(the_json) ); // Matt
    }
  }
  function handleMouseEnter() {
    setIsHovered(true);
  }
  function handleMouseLeave() {
    setIsHovered(false);
  }
  return (
    <div className="board-square"
      onClick={isPlacementStage? handleClickPlacement : handleClickGameplay}
      onMouseEnter = {handleMouseEnter}
      onMouseLeave = {handleMouseLeave}
      style={{backgroundColor:
           (function() {
            if((isMyBoard && !isPlacementStage) || (!isMyBoard && isPlacementStage))
            {
              return 'inherit';
            }
            if(isOccupied && !isHovered) {
              return '#ff8ac7';
            }
            if(isOccupied && isHovered) {
              return 'pink';
            }
            if(isEmpty) {
              return 'white';
            }
            if(isHovered) {
              return 'blue';
            }
           })()
      }}>
    </div>
  )
}
  
function BoardRow({row, boardSize, ships, myBoard}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardSquare key={"square"+{row}+"-"+i} row={row} column={i} occupied={(ships[i] != "-")} myBoard={myBoard}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({boardSize, presetBoard, myBoard}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardRow key={"row"+i} row={i} boardSize={10} ships={presetBoard.slice((i*boardSize), ((i+1)*boardSize))} myBoard={myBoard}/>);
    }
    return (
      <div className="board">{arr}</div>
    )
}
  
function Instructions({stage}) {
    let text;
    if(stage == "setup") {
      text = "Setup Stage: Click on a ship on your board and use the arrow keys to place it";
    }
    return (
      <div id="gameplay-instructions">{text}</div>
    )
}

function ConfirmButton() {
  function handleClick() {
    alert("move confirmed!");
    URL = "/confirmShips/"+playerBoard;
    alert("fetching URL "+URL);
    fetch(URL);
    isPlacementStage = false;
  }
  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <button onClick={handleClick}>Confirm!</button>
    </div>
  )
}
  
function GamePlay() {
    ({gameID, playerID} = useParams());
    alert("player: "+playerID+", game: "+gameID);
    return (
      <div>
        <HeaderAndNav playerID={"user1234"}/>
        <Instructions stage={"setup"}/>
        <ConfirmButton></ConfirmButton>
        <div id="content">
          <div className="content-row">
            <div className="content-cell">YOUR BOARD</div>
            <div className="content-cell">OPPONENT BOARD</div>
          </div>
          <div className="content-row" id="board-row">
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={playerBoard} myBoard={true}/>
            </div>
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={opponentBoard} myBoard={false}/>
            </div>
          </div>
        </div>
      </div>
    )
}

export default GamePlay
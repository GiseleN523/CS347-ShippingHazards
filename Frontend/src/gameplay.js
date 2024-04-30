import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState } from 'react';

let isPlacementStage = true;
let shipSizes = [5, 4, 3, 3, 2];
let boardSize = 10;
let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let opponentBoard = "----------------------------------------------------------------------------------------------------";

function BoardSquare({occupied}) {
  const [isOccupied, setIsOccupied] = useState(occupied == true);
  const [isAttacked, setIsAttacked] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  function handleClickPlacement() {
    
  }
  function handleClickGameplay() {

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
      style={{backgroundColor: isOccupied ? '#ff8ac7' : 'inherit'}}>
    </div>
  )
}
  
function BoardRow({boardSize, ships}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardSquare occupied={(ships[i] != "-")}/>);
    }
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board({boardSize, presetBoard}) {
    let arr = [];
    for(let i=0; i<boardSize; i++) {
      arr.push(<BoardRow boardSize={10} ships={presetBoard.slice((i*boardSize), ((i+1)*boardSize))}/>);
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
    fetch(URL);
  }
  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <button onClick={handleClick}>Confirm!</button>
    </div>
  )
}
  
function GamePlay() {
    return (
      <div>
        <HeaderAndNav />
        <Instructions stage={"setup"}/>
        <ConfirmButton></ConfirmButton>
        <div id="content">
          <div className="content-row">
            <div className="content-cell">YOUR BOARD</div>
            <div className="content-cell">OPPONENT BOARD</div>
          </div>
          <div className="content-row" id="board-row">
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={playerBoard}/>
            </div>
            <div className="content-cell">
              <Board boardSize={boardSize} presetBoard={opponentBoard}/>
            </div>
          </div>
        </div>
      </div>
    )
}

export default GamePlay
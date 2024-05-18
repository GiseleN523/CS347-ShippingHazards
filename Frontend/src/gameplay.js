import './gameplay.css';
import HeaderAndNav from './header_and_nav.js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import hitImage from './images/HitPopup.png';
import sunkImage from './images/SunkPopup.png';

const blankBoard = "----------------------------------------------------------------------------------------------------";
let playerBoard = "-----------a---------a------------bbbb----------------c---------c---------c--------------------ddddd";
let playerID;
let opponentID;
let username;
let gameID;
let boardSize;
let socket;


//returns a list of coordinates of the other squares that make up the ship at given coordinates
//input ex: [0, 0]
//output ex: [[0, 1], [0, 2], [0, 3]]
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

function BoardSquare({id, row, column, occupied, myBoard, isSetupStage, myTurn, gameStatus}) {
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
      fetch(url);
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

function BoardsAndTitles({gameStatus, setGameStatus, isSetupStage, setIsSetupStage, myTurn, setMyTurn, hitPopup1Visible, setHitPopup1Visible, hitPopup2Visible, setHitPopup2Visible, sunkPopup1Visible, setSunkPopup1Visible, sunkPopup2Visible, setSunkPopup2Visible}) {

    if(socket == undefined) {
      socket = new WebSocket("ws://localhost:8000/ws/play/"+gameID+"/");
      socket.onmessage = function(e) {
        let message = JSON.parse(JSON.parse(e.data)["message"]);
        updateBoardAndTurn(message);
      };
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
        myBoard ? setSunkPopup1Visible(true) : setSunkPopup2Visible(true);
        document.getElementById(id).style.backgroundColor = "red";
        setGameStatus(status);
        setMyTurn(turn === 1);
        setTimeout(function () {
          myBoard ? setSunkPopup1Visible(false) : setSunkPopup2Visible(false);
          entireShipAt(id, shipBoard).forEach((square) => document.getElementById((myBoard ? "mysquare-" : "opponentsquare-")+square[0]+"-"+square[1]).style.backgroundColor = "gray");
        }, 2000);
      }
      else if(isHit) {
        myBoard ? setHitPopup1Visible(true) : setHitPopup2Visible(true);
        document.getElementById(id).style.backgroundColor = "red";
        setGameStatus(status);
        setMyTurn(turn === 1);
        setTimeout(() => myBoard ? setHitPopup1Visible(false) : setHitPopup2Visible(false), 2000);
      }
      else {
        document.getElementById(id).style.backgroundColor = "white";
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
              hitPopupVisible={hitPopup1Visible} 
              sunkPopupVisible={sunkPopup1Visible} />
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
              hitPopupVisible={hitPopup2Visible}
              sunkPopupVisible={sunkPopup2Visible} />
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
          hitPopup1Visible={hitPopup1Visible}
          setHitPopup1Visible={setHitPopup1Visible}
          hitPopup2Visible={hitPopup2Visible}
          setHitPopup2Visible={setHitPopup2Visible}
          sunkPopup1Visible={sunkPopup1Visible}
          setSunkPopup1Visible={setSunkPopup1Visible}
          sunkPopup2Visible={sunkPopup2Visible}
          setSunkPopup2Visible={setSunkPopup2Visible}
        />
        <GameOverPopup gameStatus={gameStatus} />
      </div>
    )
}

export default GamePlay;
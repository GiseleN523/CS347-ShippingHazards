import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

let playerID;

function PlayButton() {
  return (
    <button className="button" type="button">Play Person</button>
  );
}

function PlayMainCompButton () {

  const [popupOpen, setPopupOpen] = useState(false); // State to control popup visibility

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };


  const Popup = ({closePopup }) => {
    return (
      <div className="popup-container">
        <div className="popup-body">
          <PlayCompButton aiID={1}/>
          <PlayCompButton aiID={2}/>
          <PlayCompButton aiID={3}/>
        <button className="popup-button"onClick={closePopup}>X</button>
        </div>
      </div>
    );
  };


  return (
    <div>
      <button className="button" type="button" onClick={openPopup}>Play AI</button>
      {popupOpen && <Popup closePopup={closePopup} />} 
    </div>
  );
}

function PlayCompButton({aiID}) {
  let gameID = 1;
  let playerID = 5;
  let boardSize = 10;

  function redirectBrowser(the_json){
      gameID = the_json["game_id"];
      window.location.replace("/game/"+playerID+"/"+gameID+"/"+boardSize);
  }

  function handleClick() {
    let playerID = 5;
    let numShips = 4;
    let boardSize = 10;
    let isAiGame = "true";
    let url = "/play/new-game/" + playerID + "/" + aiID + "/" + numShips + "/" + boardSize + "/" + isAiGame;
    fetch(url).then( response => response.json() ).then( the_json => redirectBrowser(the_json)); // Matt
  }
  return (
    <button className="popup-button" type="button" onClick={handleClick}>
      Play AI #{aiID}
    </button>
  );
}

function StatsButton() {
  return (
    <button className="button" type="button">Your Stats</button>
  );
}



function Home() {
  ({playerID} = useParams());
  return (
    <div className="header/nav">
      <HeaderAndNav playerID={playerID}/>
      <div className="buttons-container">
        <PlayButton />
        <PlayMainCompButton />

      </div>
    </div>
  );
}

export default Home

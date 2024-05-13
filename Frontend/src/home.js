import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

let playerID;

function PlayButton() {
  return (
    <button className="button" type="button">Multiplayer</button>
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


function HowToPlayButton() {

  const [popupOpen, setPopupOpen] = useState(false); 

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };


  const Popup = ({closePopup }) => {
    return (
      <div className="popup-container">
        <div className="howto-popup-paragraph">
          Choose if you want to play with another person or with and AI.
          Then place your ships in the postitions you would like.
          Each player will try to hit the ships of their opoenents on the grid. 
          Whoever sinks all of your oppenent's ships first, WINS!
        <button className="popup-button"onClick={closePopup}>X</button>
        </div>
      </div>
    );
  };


  return (
    <div>
      <button className="button" type="button" onClick={openPopup}> How to Play?</button>
      {popupOpen && <Popup closePopup={closePopup} />} 
    </div>
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
        <HowToPlayButton/>
      </div>
    </div>
  );
}

export default Home

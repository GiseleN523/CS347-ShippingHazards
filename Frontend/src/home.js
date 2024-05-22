import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

let username;
const playerID = 5;
const boardSize = 10;
const numShips = 4;

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

  function redirectBrowser(the_json){
      let gameID = the_json["game_id"];
      window.location.replace("/game/"+gameID+"/"+boardSize+"/"+aiID+"/"+playerID+"/"+username);
  }

  function handleClick() {
    let url = "/play/new-game/" + playerID + "/" + aiID + "/" + numShips + "/" + boardSize + "/" + "true";
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
  ({username} = useParams());
  return (
    <div className="header/nav">
      <HeaderAndNav username={username}/>
      <div className="buttons-container">
        <PlayButton />
        <PlayMainCompButton />
        <HowToPlayButton/>
      </div>
    </div>
  );
}

export default Home

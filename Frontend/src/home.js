/*
  Home page with three buttons: "Multiplayer", "Play AI", and "How to Play?"
  Each button opens a popup
  Multiplayer popup gives option to host game or to join a game by typing in an ID
  AI popup allows player to choose between three AI difficulties
  How to Play popup lets user read about how to play Battleship
  This page can be reached by logging in, creating an account, clicking "Home" or the logo in the header, or by finishing a game
*/

import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TextFieldWithError from './text_field_with_error';

let username;
const boardSize = 10;
const numShips = 4;

// popup that opens when player clicks "Multiplayer" button
function MultiplayerPopup({closePopup, joinID, setJoinID, joinErrorVisible, setJoinErrorVisible}) {

  const navigate = useNavigate();

  function attemptJoin(the_json, playerID, color){
    let success = the_json["status"] === 1;
    let playerNum = 2;
    let existingGame = false;
    let isAIGame = false;
    if(success) {
      navigate("/game/"+joinID+"/"+boardSize+"/"+playerID+"/"+username+"/"+color+"/"+playerNum+"/"+isAIGame+"/"+existingGame);
    }
    else {
      setJoinErrorVisible(true);
    }
  }

  function handleJoinClick() {
    if(joinID.length < 1) {
      setJoinErrorVisible(true);
    }
    else {
      let url = "/play/get-player-info/" + username;
      fetch(url)
        .then(response => response.json())
        .then((the_json) => {
          let playerID = the_json["player_id"];
          let color = the_json["color_preference"];
          let url2 = "/play/change-opponent/" + joinID + "/" + playerID;
          fetch(url2)
            .then( response => response.json() )
            .then( the_json => attemptJoin(the_json, playerID, color));
        })
        .catch(error => console.error('Error fetching player info and opponent change: ', error));
    }
  }

  return (
    <div className="popup-container">
      <div className="popup-body">
        <TextFieldWithError
            placeholder={"Join Room ID"}
            value={joinID} 
            setValue={setJoinID} 
            errorVisible={joinErrorVisible}
            errorMessage={"Invalid game ID, or game is already full. After your friend starts a game, ask them for the ID."}
            style={{width: '10em', display: 'inline'}} />
        <button className="popup-button" type="button" onClick={handleJoinClick}>Join Room</button>
        <NewGameButton text={"Create New Room"} isAI={false} opponentID={4} />
        <button className="popup-button" onClick={closePopup}>X</button>
      </div>
    </div>
  );
};

// button that controls Multiplayer popup visibility
function PlayMultiplayerButton() {

  const [popupOpen, setPopupOpen] = useState(false); // State to control popup visibility
  const [joinErrorVisible, setJoinErrorVisible] = useState(false);
  const [joinID, setJoinID] = useState('');

  const openPopup = () => {
    setPopupOpen(true);
    setJoinErrorVisible(false);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div>
      <button className="button" type="button" onClick={openPopup}>Multiplayer</button>
      {popupOpen && <MultiplayerPopup closePopup={closePopup} joinID={joinID} setJoinID={setJoinID} joinErrorVisible={joinErrorVisible} setJoinErrorVisible={setJoinErrorVisible}/>} 
    </div>
  );
}

// button that opens popup to play against an AI
function PlayMainCompButton () {

  const [popupOpen, setPopupOpen] = useState(false); // State to control popup visibility

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };


  // popup where user can choose between three AIs to play against
  const Popup = ({closePopup }) => {
    return (
      <div className="popup-container">
        <div className="popup-body">
          <NewGameButton text={"Easy"} isAI={true} opponentID={1}/>
          <NewGameButton text={"Medium"} isAI={true} opponentID={2}/>
          <NewGameButton text={"Hard"} isAI={true} opponentID={3}/>
          <button className="popup-button" onClick={closePopup}>X</button>
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

// component for button that starts a new game with given opponent when clicked
function NewGameButton({text, isAI, opponentID}) {

  const navigate = useNavigate();

  function redirectBrowser(the_json, playerID, color){
    let gameID = the_json["game_id"];
    let playerNum = 1;
    let existingGame = false;
    navigate("/game/"+gameID+"/"+boardSize+"/"+playerID+"/"+username+"/"+color+"/"+playerNum+"/"+isAI+"/"+existingGame);
  }

  function handleClick() {
    let url = "/play/get-player-info/" + username;
    fetch(url)
      .then(response => response.json())
      .then((the_json) => {
        let playerID = the_json["player_id"];
        let color = the_json["color_preference"];
        let url2 = "/play/new-game/" + playerID + "/" + opponentID + "/" + numShips + "/" + boardSize + "/" + isAI;
        fetch(url2)
          .then( response => response.json() )
          .then( the_json => redirectBrowser(the_json, playerID, color));
      })
      .catch(error => console.error('Error fetching player info and new game: ', error));
  }
  return (
    <button className="popup-button" type="button" onClick={handleClick}>{text}</button>
  );
}

// button that, when clicked, opens popup with How to Play information
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
          <button className="popup-button" onClick={closePopup} style={{float: 'right'}}>X</button>
          <div>
            Choose if you want to play with another person or with an AI.<br /><br />
            Then place your ships in the postitions you would like, using the arrow keys and space bar.<br /><br />
            Players will take turns trying to hit the ships of their opponents on the grid by clicking.<br /><br />
            If you get a hit or fully sink a ship, you get to go again.<br /><br />
            Whoever sinks all of your oppenent's ships first, WINS!<br /><br />
          </div>
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
    <div>
      <HeaderAndNav username={username}/>
      <div className="buttons-container">
        <PlayMultiplayerButton />
        <PlayMainCompButton />
        <HowToPlayButton />
      </div>
    </div>
  );
}

export default Home;
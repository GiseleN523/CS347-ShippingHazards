import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TextFieldWithError from './text_field_with_error';

let username;
const boardSize = 10;
const numShips = 4;

function MultiplayerPopup({closePopup, joinID, setJoinID, joinErrorVisible, setJoinErrorVisible}) {

  const navigate = useNavigate();

  function attemptJoin(the_json, playerID, color){
    let success = the_json["status"] === 1;
    let playerNum = 2;
    if(success) {
      navigate("/game/"+joinID+"/"+boardSize+"/"+playerID+"/"+username+"/"+color+"/"+playerNum);
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
      });
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
          <NewGameButton text={"Play AI #1"} isAI={true} opponentID={1}/>
          <NewGameButton text={"Play AI #2"} isAI={true} opponentID={2}/>
          <NewGameButton text={"Play AI #3"} isAI={true} opponentID={3}/>
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

function NewGameButton({text, isAI, opponentID}) {

  const navigate = useNavigate();

  function redirectBrowser(the_json, playerID, color){
    let gameID = the_json["game_id"];
    let playerNum = 1;
    navigate("/game/"+gameID+"/"+boardSize+"/"+playerID+"/"+username+"/"+color+"/"+playerNum);
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
    });
  }
  return (
    <button className="popup-button" type="button" onClick={handleClick}>{text}</button>
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

export default Home
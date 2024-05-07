import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

let playerID;

function PlayButton() {
  return (
    <button className="button" type="button">Play Person</button>
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
    <button className="button" type="button" onClick={handleClick}>
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
        <PlayCompButton aiID={1}/>
        <PlayCompButton aiID={2}/>
        <PlayCompButton aiID={3}/>

      </div>
    </div>
  );
}

export default Home

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


function PlayCompButton() {
  let gameID = 1;

  function redirectBrowser(the_json){
      gameID = the_json["gameID"];
      window.location.replace("/game/playerId/gameID");
  }

  function handleClick() {
    let aiType = "randomAI";
    let numShips = 4;
    let url = "http://name:port/new-game-ai/"+playerID+"/"+aiType+"/"+numShips;
    alert("fetching URL: "+url);
    //fetch(URL).then( response => response.json()).then( the_json => redirectBrowser(the_json)); // Matt
  }
  return (
    <Link to={"/game/"+playerID+"/"+gameID} className="button" type="button" onClick={handleClick}>
      Play Computer
    </Link>
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
        <PlayCompButton />
        <StatsButton />

      </div>
    </div>
  );
}

export default Home
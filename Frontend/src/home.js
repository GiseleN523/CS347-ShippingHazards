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
  function handleClick() {
    //URL = "/new-game/0000/"+playerID+"/4";
    alert("fetching URL: "+"/new-game/0000/"+playerID+"/4");
    //fetch(URL).then( response => response.json()).then( the_json => gameID = the_json['gameID']); // Matt
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
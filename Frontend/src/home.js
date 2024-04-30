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
    URL = "/newgame/0000/"+playerID;
    fetch(URL).then( response => response.json()).then( the_json => gameID = the_json['gameID']); // Matt
  }
  return (
    <Link to={"/game/"+playerID+"/"+gameID} className="button" type="button">
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
import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { Link } from 'react-router-dom';

function PlayButton() {
  return (
    <Link to="/game" className="button" type="button">
      Play Person
    </Link>
  );
}

function PlayCompButton() {
  return (
    <button className="button" type="button">Play Computer</button>
  );
}

function StatsButton() {
  return (
    <button className="button" type="button">Your Stats</button>
  );
}


function Home() {
  return (
    <div className="header/nav">
      <HeaderAndNav />
      <div className="buttons-container">
        <PlayButton />
        <PlayCompButton />
        <StatsButton />

      </div>
    </div>
  );
}

export default Home
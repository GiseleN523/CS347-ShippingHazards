
import './home.css'
import HeaderAndNav from './header_and_nav.js';
import { Link } from 'react-router-dom';

function PlayButton() {
  return (
    <Link to="/game" className="button" type="button">
      Play Game
    </Link>
  );
}

function StatsButton() {
  return (
    <button className="button" type="button">Stats</button>
  );
}

function SettingsButton() {
  return (
    <button className="button" type="button">Settings</button>
  );
}

function Home() {
  return (
    <div className="header/nav">
      <HeaderAndNav />
      <div className="buttons-container">
        <PlayButton />
        <StatsButton />
        <SettingsButton />
      </div>
    </div>
  );
}

export default Home
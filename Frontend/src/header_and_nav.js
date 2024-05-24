import logo from './images/logo.png';
import './header_and_nav.css';
import {useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

let username;
let screenName;

function Header() {
    const navigate = useNavigate();
    return (
      <header>
        <img src= {logo} alt="Logo" id="logo" style={{cursor: 'pointer'}} onClick={() => navigate('/home/'+username)}/>
        <span id="header-text">SHIPPING HAZARDS: A Game By Pink Puffy Rhinos</span>
        <div id="user-info">
          <p>Hello, {username}!</p>
          <a href="/">Logout</a>
        </div>
      </header>
    )
}
  
function NavigationBar() {
  return (
    <nav>
      <a href={"/home/" + username}>Home</a>
      <span className="dropdown">
        My Account
        <span className="dropdown-content">
          <a href={"/profile/" + username}>Profile & Settings</a>
          <a href={"/play/get-player-info/" + username}>Stats</a>
        </span>
      </span>
      <a href={"/aboutus/" + username}>About Us</a>
    </nav>
  );
}
function HeaderAndNav() {
  ({username} = useParams());
  /*let url = "play/get-player-info/"+username;
  fetch(url)
    .then(response => response.json())
    .then(the_json => screenName = the_json["screen_name"]);*/
  return (
    <div>
      <Header />
      <NavigationBar />
    </div>
  )
}

export default HeaderAndNav;
/*
  Component HeaderAndNav; includes the logo, title, Hello message, logout button, and navigation bar links
  Used in most pages of the site
  Requires username as a parameter, which is used to get the screenName and display it in the top right corner
  Logo can be clicked to navigate to home
*/

import logo from './images/logo.png';
import './header_and_nav.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

let username;

function Header({screenName}) {

    const navigate = useNavigate();

    return (
      <header>
        <img src= {logo} alt="Logo" id="logo" style={{cursor: 'pointer'}} onClick={() => navigate('/home/'+username)}/>
        <span id="header-text">SHIPPING HAZARDS: A Game By Pink Puffy Rhinos</span>
        <div id="user-info">
          <p>Hello, {screenName}!</p>
          <a href="/">Logout</a>
        </div>
      </header>
    )
}
  
function NavigationBar() {

  const navigate = useNavigate();

  function navigateToProfilePage() {
    let url = "/play/get-player-info/" + username;
    fetch(url)
      .then(response => response.json())
      .then((the_json) => {
        navigate("/profile/"+username+"/"+the_json["color_preference"]+"/"+the_json["screen_name"]);
    });
  }

  return (
    <nav>
      <a href={"/home/" + username}>Home</a>
      <span className="dropdown">
        My Account
        <span className="dropdown-content">
          <a onClick={navigateToProfilePage}>Profile & Settings</a>
          <a href={"/play/get-player-info/" + username}>Stats</a>
        </span>
      </span>
      <a href={"/aboutus/" + username}>About Us</a>
    </nav>
  );
}
function HeaderAndNav() {

  ({username} = useParams());

  // display username in corner temporarily
  const [screenName, setScreenName] = useState(username);

  // fetch screenname and put it in top right corner once it's ready
  let url = "/play/get-player-info/" +username;
  fetch(url)
    .then(response => response.json())
    .then(the_json => setScreenName(the_json["screen_name"]));

  return (
    <div>
      <Header screenName={screenName}/>
      <NavigationBar />
    </div>
  )
}

export default HeaderAndNav;
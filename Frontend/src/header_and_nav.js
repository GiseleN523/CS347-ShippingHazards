import logo from './images/logo.png';
import './header_and_nav.css'
import { useParams } from 'react-router-dom';


let playerID;

function Header({username}) {
    return (
      <header>
        <img src= {logo} alt="Logo" className="logo"/>
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
    <nav className="nav">
      <a href={"/home/" + playerID}>Home</a>
      <span className="dropdown">
        <span>My Account</span>
        <span className="dropdown-content">
          <a href={"/profile/" + playerID}>Profile</a>
          <a href={"/myaccount/stats/" + playerID}>Stats</a>
          <a href={"/settings/" + playerID}>Settings</a>
        </span>
      </span>
      <a href={"/aboutus/" + playerID}>About Us</a>
    </nav>
  );
}
function HeaderAndNav() {
  ({playerID} = useParams());
    return (
        <div>
            <Header username={playerID}/>
            <NavigationBar />
        </div>
    )
}

export default HeaderAndNav;
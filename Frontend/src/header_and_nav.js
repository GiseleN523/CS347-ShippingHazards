import logo from './images/logo.png';
import './header_and_nav.css'
import { useParams } from 'react-router-dom';

let username;

function Header() {
    return (
      <header>
        <img src= {logo} alt="Logo" id="logo"/>
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
          <a href={"/myaccount/stats/" + username}>Stats</a>
        </span>
      </span>
      <a href={"/aboutus/" + username}>About Us</a>
    </nav>
  );
}
function HeaderAndNav() {
  ({username} = useParams());
    return (
        <div>
            <Header />
            <NavigationBar />
        </div>
    )
}

export default HeaderAndNav;
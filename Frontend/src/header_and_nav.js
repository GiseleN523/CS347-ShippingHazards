import logo from './images/logo.png';
import './header_and_nav.css'

function Header({username}) {
    return (
      <header>
        <img src= {logo} alt="Logo" className="logo"/>
        <span id="header-text">SHIPPING HAZARDS: A Game By Pink Puffy Rhinos</span>
        <div id="user-info">
          <p>Hello, {username}!</p>
          <a href="">Logout</a>
        </div>
      </header>
    )
}
  
function NavigationBar() {
    return (
      <nav>
        <a href="/">Home</a>
        <a href="/settings">Settings</a>
        <a href="/myaccount">My Account</a>
        <a href="/aboutus">About Us</a>
      </nav>
    )
}

function HeaderAndNav() {
    return (
        <div>
            <Header username={"user12345"}/>
            <NavigationBar />
        </div>
    )
}

export default HeaderAndNav;
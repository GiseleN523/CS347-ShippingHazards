import logo from './images/logo.png';
import './header_and_nav.css'

function Header() {
    return (
      <header>
        <img src= {logo} alt="Logo" className="logo"/>
        <span id="header-text">SHIPPING HAZARDS: A Game By Pink Puffy Rhinos</span>
      </header>
    )
}
  
function NavigationBar() {
    return (
      <nav>
        <ul className="nav-list">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/aboutus">About Us</a>
          </li>
          <li>
            <a href="/myaccount">My Account/Log Out</a>
          </li>
        </ul>
      </nav>
    )
}

function HeaderAndNav() {
    return (
        <div>
            <Header />
            <NavigationBar />
        </div>
    )
}

export default HeaderAndNav;
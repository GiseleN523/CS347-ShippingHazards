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
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about_us">About Us</a>
          </li>
          <li>
            <a href="#my_account">My Account/Log Out</a>
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
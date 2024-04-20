import logo from './images/logo.png';
import './App.css';


function App() {
  return (
    <div>
      <header className="App-Header">
        <div className="logo">
          <img src= {logo} alt="Logo" />
        </div>
        <div className="header-text">
          <h1>SHIPPING HAZARDS: A Game By Pink Puffy Rhinos</h1>
        </div>
      </header>
      <nav className="App-Navigation">
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
    </div>
  );
}


export default App;

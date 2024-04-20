import logo from './images/logo.png';
import './App.css';
//import { useState } from 'react';
/*
function Navigation(){
  return (
    <nav class="App-Navigation">
      <img src={logo} alt="logo" />
      <p1>SHIPPING HAZARDS: A game by Pink Puffy Rhinos</p1>
      <li>Home</li>
      <li>About Us</li>
      <li>My Account/Log Out</li>
    </nav>

  )
}*/


function App() {
  return (
    <div>
      <header className="App-Header">
        <div className="logo">
          <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTJ_MAD51R5iBkzA6xH7gLe5gAtXYxzJvQxHfvccT7yjXfru-sX" alt="Logo" />
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
/*  function App() {
    return (
      <div>
        <Navigation></Navigation>
        <div className="App">
          <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a> }
          </header>
        </div>
      </div>
    );
  }*/



export default App;

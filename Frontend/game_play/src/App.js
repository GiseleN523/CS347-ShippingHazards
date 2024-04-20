import logo from './images/logo.png';
import './App.css';
import './GamePlay.css';
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

function GridSquare() {
  return (
    <div className="grid-square"></div>
  )
}

function GridRow(size) {
  size = 10
  let result = [];
  for (let i = 0; i < size; i++) {
    result.push(<GridSquare />);
  }
  return (
    <div id="grid-row">{result}</div>
  )
}

function Grid(size) {
  size = 10
  let result = [];
  for (let i = 0; i < size; i++) {
    result.push(<GridRow />);
  }
  console.log(result)
  return (
    <div id="grid">{result}</div>
  )
}

function GamePlay() {
  return (
    <Grid />
  )
}

function InstructionBox() {
  return (
    <div id="instruction-box" className="box">
      Your Turn: Choose a spot to attack!
    </div>
  )
}

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
      <InstructionBox />
      <GamePlay />
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

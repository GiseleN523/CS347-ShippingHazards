import logo from './images/logo.png';
import './App.css';

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
      <InstructionBox />
      <GamePlay />
    </div>
  );
}


export default App;

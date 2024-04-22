import './gameplay.css'
import HeaderAndNav from './header_and_nav.js';

function BoardSquare() {
    return (
      <div className="board-square"></div>
    )
}
  
function BoardRow() {
    let size = 10
    let arr = Array(size).fill(<BoardSquare />)
    return (
      <div className="board-row">{arr}</div>
    )
}
  
function Board() {
    let size = 10
    let arr = Array(size).fill(<BoardRow />);
    return (
      <div className="board">{arr}</div>
    )
}
  
function Instructions() {
    return (
      <div id="gameplay-instructions">
        Your Turn: Choose a spot to attack!
      </div>
    )
}
  
function GamePlay() {
    return (
      <div>
        <HeaderAndNav />
        <Instructions />
        <div id="content">
          <div className="content-row">
            <div className="content-cell">YOUR BOARD</div>
            <div className="content-cell">OPPONENT BOARD</div>
          </div>
          <div className="content-row" id="board-row">
            <div className="content-cell">
              <Board />
            </div>
            <div className="content-cell">
              <Board />
            </div>
          </div>
        </div>
      </div>
    )
}

export default GamePlay
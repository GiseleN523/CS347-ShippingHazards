import React, { useState, useEffect } from 'react';
import './mygames.css';
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

<<<<<<< HEAD

function MyGamesTable() {

    return (
      <div className='mygamestable'>
        <h1>Your Active Games!</h1>
        <table>
          <thead>
            <tr>
              <th>Games</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Links </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
}

function MyGamesPage() {
    const { username } = useParams();
  
    return (
      <div>
        <HeaderAndNav username={username} />
        <MyGamesTable the_json={playerStats} />
      </div>
    );
}
  
=======
/*function MyGamesTable(the_json) {

  let game_id = the_json["id"];
  let is_ai_game = the_json["is_ai_game"];
  let player1_id = the_json["player1_id"];
  let player2_id = the_json["player2_id"];
  let board1_id = the_json["board1ID"];
  let board2_id = the_json["board2ID"];
  let turn = the_json["turn"];
  let num_ships = the_json["num_ships"];
  let winner = the_json["winner"];
  let loser = the_json["loser"];


  return (
    <div className='mygamestable'>
      <h1>Your  Games!</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Is AI Game</th>
            <th>Player 1 ID</th>
            <th>Player 2 ID</th>
            <th>Board 1 ID</th>
            <th>Board 2 ID</th>
            <th>Turn</th>
            <th>Status</th>
            <th>Number of Ships</th>
            <th>Winner</th>
            <th>Loser</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>{game_id}</td>
              <td>{is_ai_game ? 'Yes' : 'No'}</td>
              <td>{player1_id}</td>
              <td>{player2_id}</td>
              <td>{board1_id}</td>
              <td>{board2_id}</td>
              <td>{turn}</td>
              <td>{num_ships}</td>
              <td>{winner}</td>
              <td>{loser}</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
  
}*/

function MyGamesTable({ games }) {
  return (
    <div className='mygamestable'>
      <h1>Your Games!</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Is AI Game</th>
            <th>Player 1 ID</th>
            <th>Player 2 ID</th>
            <th>Board 1 ID</th>
            <th>Board 2 ID</th>
            <th>Turn</th>
            <th>Status</th>
            <th>Number of Ships</th>
            <th>Winner</th>
            <th>Loser</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td>{game.is_ai_game ? 'Yes' : 'No'}</td>
              <td>{game.player1_id}</td>
              <td>{game.player2_id}</td>
              <td>{game.board1ID}</td>
              <td>{game.board2ID}</td>
              <td>{game.turn}</td>
              <td>{game.num_ships}</td>
              <td>{game.winner}</td>
              <td>{game.loser}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




function MyGamesPage() {
  const { username, status } = useParams();  // Get the username and status from the URL parameters
  const [games, setGames] = useState([]);

  useEffect(() => {
    const url = "/"+username +"/games/active";
    fetch(url)
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(error => console.error('Error fetching games:', error));
  }, [username, status]);  

  return (
    <div>
      <HeaderAndNav username={username} />
      <MyGamesTable games= {games}/> 
    </div>
  );
}

>>>>>>> 78e5971448e479a992b1725681b6d67d0b28f44d
export default MyGamesPage;


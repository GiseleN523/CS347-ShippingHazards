/*
  Page that shows a table of user's game history
  User can filter by Active Games, Inactive Games, or All
  For active games, link is generated so that user can rejoin
*/
import React, { useState, useEffect } from 'react';
import './mygames.css';
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

let username;

function MyGamesTable({games}) {

  const navigate = useNavigate();

  function handleClick(game) {

    let url = "/play/get-player-info/" + username;
    fetch(url)
      .then(response => response.json())
      .then((the_json) => {
        let playerID = the_json["player_id"];
        let color = the_json["color_preference"];
        let boardSize = 10
        let playerNum = (game.player1_id === playerID) ? 1 : 2;
        navigate("/game/"+game.id+"/"+ boardSize +"/"+playerID+"/"+username+"/"+color+"/"+playerNum+"/"+game.is_ai_game);

      })
      .catch(error => console.error('Error fetching player info and new game: ', error));
  }


  return (
    <div className='mygamestable'>
      <h1>Your Games!</h1>
      <table>
        <thead>
          <tr>
            <th> Game ID</th>
            <th>Is AI Game</th>
            <th>Player 1 ID</th>
            <th>Player 2 ID</th>
            <th>Status</th>
            <th>Link</th>
            <th>Turn</th>
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
              <td>{game.status ? 'Inactive' : 'Active'}</td>
              <td>
                {game.status === 0 && (
                  <button onClick={() => handleClick(game)}>Play</button>
                )}
              </td>
              <td>{game.turn ? 'Mine' : 'Opponent'}</td>
              <td>{game.num_ships} </td>
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
  ({username} = useParams()); // Get the username from the URL parameters
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('all'); // Default filter is 'all'

  useEffect(() => {
    let url = "/" +username +"/games/" +filter;
    fetch(url)
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(error => console.error('Error fetching games:', error));
  }, [username, filter]);  

  return (
    <div>
      <HeaderAndNav username={username} />
      <div className="toggle-buttons-container">
        <button
          className={`toggle-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Games
        </button>
        <button
          className={`toggle-button ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active Games
        </button>
        <button
          className={`toggle-button ${filter === 'inactive' ? 'active' : ''}`}
          onClick={() => setFilter('inactive')}
        >
          Inactive Games
        </button>
      </div>
      <MyGamesTable games={games}/> 
    </div>
  );
}


export default MyGamesPage;

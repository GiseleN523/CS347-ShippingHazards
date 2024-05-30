import React, { useState, useEffect } from 'react';
import './mygames.css';
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

let username;
let color;
let playerNum;
let boardSize;

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
              <td>{game.board1ID}</td>
              <td>{game.board2ID}</td>
              <td>{game.status ? 'Active' : 'Inactive'}</td>
              <td>{"/game/"+game.id+"/"+boardSize+"/"+game.player1_id+"/"+username+"/"+color+"/"+playerNum}</td>
              <td>{game.turn ? 'Mine' : 'Opponent'}</td>
              <td>{game.num_ships} </td>
              <td>{game.winner ? 'Me' : 'Opponent'}</td>
              <td>{game.loser ? 'Me' : 'Opponent'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function MyGamesPage() {
  const { username } = useParams(); // Get the username from the URL parameters
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


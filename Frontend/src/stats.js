import React, { useState, useEffect } from 'react';
import './stats.css';
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

let username;


function StatsTable({ the_json }) {
  if (!the_json) {
    return <div>Loading...</div>;
  }

  let winStats = the_json["wins"];
  let lossStats = the_json["losses"];
  let shipsStats = the_json["num_of_ships_sunk"];

  return (
    <div className='statstable'>
      <h1>Your Stats!</h1>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Results</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Wins</td>
            <td>{winStats}</td>
          </tr>
          <tr>
            <td>Losses</td>
            <td>{lossStats}</td>
          </tr>
          <tr>
            <td>Ships Sunk</td>
            <td>{shipsStats}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function StatsPage() {
  const { username } = useParams();
  const [playerStats, setPlayerStats] = useState(null);

  useEffect(() => {
    let url = "/play/get-player-info/" + username;
    fetch(url)
      .then(response => response.json())
      .then(the_json => setPlayerStats(the_json))
      .catch(error => console.error('Error fetching player stats:', error));
  }, [username]);

  return (
    <div>
      <HeaderAndNav username={username} />
      <StatsTable the_json={playerStats} />
    </div>
  );
}

export default StatsPage;
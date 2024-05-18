import React, { useState, useEffect } from 'react';
import './stats.css';
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

let playerID
let username;

function StatsTable({ wins, losses, num_of_ships_sunk }) {
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
            <td>{wins}</td>
          </tr>
          <tr>
            <td>Losses</td>
            <td>{losses}</td>
          </tr>
          <tr>
            <td>Ships Sunk</td>
            <td>{num_of_ships_sunk}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function StatsPage() {
  const { username } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let playerID = username;  
    let url = `/get-player-info/${playerID}`;

    fetch(url)
      .then(response => response.json())
      .then(the_json => {
        setStats(the_json);
      });
  }, [username]);

  return (
    <div>
      <HeaderAndNav username={username} />
      <StatsTable stats={stats} />
    </div>
  );
}

export default StatsPage;
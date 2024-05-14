import React, { useState } from 'react';
import './stats.css'
import HeaderAndNav from './header_and_nav.js';
import AccountPageSidebar from './myaccount.js';
import { useParams } from 'react-router-dom';


let username;
const StatsTable = () => {
 /*
  let attackBoard = the_json["attack_board"];
  let shipBoard = the_json["ship_board"];
  let turn = the_json["turn"];
  let status = the_json["status"];
  let is_hit = the_json["is_hit"];
  let shot_row = the_json["shot_row"];
  let shot_col = the_json["shot_col"];
  */

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
            <td>{50}</td>
          </tr>
          <tr>
            <td>Losses</td>
            <td>{20}</td>
          </tr>
          <tr>
            <td>Ships Sunk</td>
            <td>{1000}</td>
          </tr>
          <tr>
            <td>Total Games</td>
            <td>{84}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};


function StatsPage() {
  const { username } = useParams();
  return (
    <div>
    <HeaderAndNav usrename={username}/>
     <StatsTable /> 
     </div>
  
  );
}

export default StatsPage;
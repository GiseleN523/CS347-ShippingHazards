import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.js';
import AboutUs from './aboutus.js';
import MyAccount from './myaccount.js';
import GamePlay from './gameplay.js';
import StatsPage from './stats.js';
import './index.css'
import Login from './login.js';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/:username" element={<Home />} />
        <Route path="/myaccount/:username" element={<MyAccount />} />
        <Route path="/aboutus/:username" element={<AboutUs />} />
        <Route path="/game/:gameID/:boardSize/:opponentID/:playerID/:username/" element={<GamePlay />} />
        <Route path="/myaccount/stats/:username" element={<StatsPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
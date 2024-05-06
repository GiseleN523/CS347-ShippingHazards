import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.js';
import Settings from './settings.js';
import AboutUs from './aboutus.js';
import MyAccount from './myaccount.js';
import GamePlay from './gameplay.js';
import './index.css'
import Login from './login.js';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/:playerID" element={<Home />} />
        <Route path="/settings/:playerID" element={<Settings />} />
        <Route path="/myaccount/:playerID" element={<MyAccount />} />
        <Route path="/aboutus/:playerID" element={<AboutUs />} />
        <Route path="/game/:playerID/:gameID/:boardSize" element={<GamePlay />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
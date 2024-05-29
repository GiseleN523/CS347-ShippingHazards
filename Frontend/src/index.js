/*
  Root of the React project
  Creates routes to all pages that will be linked/navigated to in the project
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.js';
import CreateAccount from './create_account.js';
import AboutUs from './aboutus.js';
import GamePlay from './gameplay.js';
import StatsPage from './stats.js';
import Login from './login.js';
import ProfilePage from './profile.js';
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createaccount/:fillerUsername" element={<CreateAccount />} />
        <Route path="/createaccount/" element={<CreateAccount />} />
        <Route path="/home/:username" element={<Home />} />
        <Route path="/aboutus/:username" element={<AboutUs />} />
        <Route path="/game/:gameID/:boardSize/:playerID/:username/:shipColor/:playerNum" element={<GamePlay />} />
        <Route path="/profile/:username/:originalColor/:originalScreenName" element={<ProfilePage />} />
        <Route path="play/get-player-info/:username" element={<StatsPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
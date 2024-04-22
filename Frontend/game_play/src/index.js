import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.js';
import AboutUs from './aboutus.js';
import MyAccount from './myaccount.js';
import GamePlay from './gameplay.js';
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/game" element={<GamePlay />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
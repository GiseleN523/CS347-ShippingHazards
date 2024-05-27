/*
  "About Us" page with list of our names and a link to our Github
  Can be accessed from a button in the navigation bar
*/

import './aboutus.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

let username;

function AboutUs() {
  ({username} = useParams());
  return (
    <div>
      <HeaderAndNav username={username}/>
      <div id="description">
        <p>This is a project written in Spring 2024 for CS 347 (Advanced Software Design) at Carleton College in Northfield, MN.</p>
        <p>The team was:</p>
        <ul>
          <li>Frontend: Cece Che Tita & Gisele Nelson</li>
          <li>Game Logic and AI Players: Willow Gu & Josh Meier</li>
          <li>Backend/Database: Kendra Winhall & Ryan Dunn</li>
        </ul>
        <p>For more information about the project, including our source code and how to run it, see our <a href="https://github.com/GiseleN523/CS347-ShippingHazards" target="_blank" rel="noreferrer">Github page</a>.</p>
      </div>
    </div>
  );
}


export default AboutUs
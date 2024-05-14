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
        <p> This is a project written by Cece che Tita, Gisele Nelson, Willow Gu, Josh Meier, Kendra Winhall, and Ryan Dunn in Spring 2024 for CS 347 (Advanced Software Design) at Carleton College in Northfield, MN. </p>
      </div>
    </div>
  );
}


export default AboutUs
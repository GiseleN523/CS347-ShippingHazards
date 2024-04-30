import './settings.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

let playerID;

function Settings() {
  ({playerID} = useParams());
    return (
      <div>
        <HeaderAndNav playerID={playerID}/>
        Settings Page
      </div>
    )
}

export default Settings

import './myaccount.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

let playerID;

function MyAccount() {
    ({playerID} = useParams());
    return (
      <div>
        <HeaderAndNav playerID={playerID}/>
        My Account
      </div>
    )
}

export default MyAccount
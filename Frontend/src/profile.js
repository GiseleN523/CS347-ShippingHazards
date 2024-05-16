import './profile.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';

let username;

function ProfilePage() {
  ({username} = useParams());
  function handleClick() {
    console.log("saved");
  }
  return (
    <div>
      <HeaderAndNav username={username}/>
      <main>
        <div id="account">Account name: {username}</div>
        <form>
            <label for="password">New password:</label><br></br>
            <input type="password" id="password" name="password"></input><br></br>
            <label for="password2">Retype new password:</label><br></br>
            <input type="password" id="password2" name="password2"></input><br></br>
            <label for="color">Ship Color:</label>
            <input type="color" id="color" name="color" value="#ff8ac7"></input><br></br>
            <button onClick={handleClick}>Save Changes</button>
        </form>
      </main>
    </div>
  );
}


export default ProfilePage
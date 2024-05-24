import './profile.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams } from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import TextFieldWithError from './text_field_with_error.js';

let username;

function ProfilePage() {
  const navigate = useNavigate();
  ({username} = useParams());

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [screenName, setScreenName] = useState(username);
  const [color, setColor] = useState('');
  const [currentPasswordErrorVisible, setCurrentPasswordErrorVisible] = useState(false);
  const [newPassword1ErrorVisible, setNewPassword1ErrorVisible] = useState(false);
  const [newPassword2ErrorVisible, setNewPassword2ErrorVisible] = useState(false);
  const [screenNameErrorVisible, setScreenNameErrorVisible] = useState(false);
  const [backendErrorVisible, setBackendErrorVisible] = useState(false);
  const [backendErrorText, setBackendErrorText] = useState('');

  function attemptPasswordScreenNameChange(the_json) {
    setCurrentPasswordErrorVisible(false);
    setNewPassword1ErrorVisible(false);
    setNewPassword2ErrorVisible(false);
    setScreenNameErrorVisible(false);
    setBackendErrorVisible(false);
    let success = the_json["status"] == "success";
    let message = the_json["message"];
    if(success) {
      navigate('/home/'+username);
    }
    else {
      setBackendErrorText(message);
      setBackendErrorVisible(true);
    }
  }

  function handleClick() {
    currentPassword.length == 0 ? setCurrentPasswordErrorVisible(true) : setCurrentPasswordErrorVisible(false);
    newPassword1.length == 0 ? setNewPassword1ErrorVisible(true) : setNewPassword1ErrorVisible(false);
    newPassword2.length == 0 ? setNewPassword2ErrorVisible(true) : setNewPassword2ErrorVisible(false);
    //screenName.length == 0 ? setScreenNameErrorVisible(true) : setScreenNameErrorVisible(false);
    let url = "react_change_password/"+username+"/"+currentPassword+"/"+newPassword1+"/"+newPassword2;
    fetch(url)
        .then( response => response.json())
        .then(the_json => attemptPasswordScreenNameChange(the_json));
    //let url2 = path("react_change_color/"+color);
    //fetch(url2);
  }
  return (
    <div>
      <HeaderAndNav username={username}/>
      <main>
        <div id="account">Account name: {username}</div>
        <div id="profileSettings">
            Current Password
            <TextFieldWithError password={true} value={currentPassword} setValue={setCurrentPassword} errorVisible={currentPasswordErrorVisible}/>
            New Password
            <TextFieldWithError password={true} value={newPassword1} setValue={setNewPassword1} errorVisible={newPassword1ErrorVisible}/>
            Retype New Password
            <TextFieldWithError password={true} value={newPassword2} setValue={setNewPassword2} errorVisible={newPassword2ErrorVisible}/>
            Screen Name
            <TextFieldWithError value={screenName} setValue={setScreenName} errorVisible={screenNameErrorVisible}/>
            Ship Color
            <input type="color" 
                  id="color"
                  name="color"
                  value="#ff8ac7"
                  onChange={(ev) => setColor(ev.target.value)}
                  style={{marginLeft: '1em'}}
            ></input><br />
            <button onClick={handleClick}>Save Changes</button><br />
        </div>
      </main>
    </div>
  );
}


export default ProfilePage
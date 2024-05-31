/*
  This is the page where users can change their account settings
  Users can change their password by typing their old password and then their new password twice
  In another section, users can change their screen name and ship color
  These two sections have separate "Update" buttons; after one is clicked, user is redirected to home
*/

import './profile.css'
import HeaderAndNav from './header_and_nav.js';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import TextFieldWithError from './text_field_with_error.js';

let username;
let originalColor;
let originalScreenName;

function ProfilePage() {
  const navigate = useNavigate();
  ({username, originalColor, originalScreenName} = useParams());

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [screenName, setScreenName] = useState(originalScreenName);
  const [color, setColor] = useState("#"+originalColor);

  // errors set by frontend when a required field is not filled out 
  const [currentPasswordErrorVisible, setCurrentPasswordErrorVisible] = useState(false);
  const [newPassword1ErrorVisible, setNewPassword1ErrorVisible] = useState(false);
  const [newPassword2ErrorVisible, setNewPassword2ErrorVisible] = useState(false);
  const [screenNameErrorVisible, setScreenNameErrorVisible] = useState(false);

  // custom error sent by backend when value given is invalid
  const [backendErrorVisible, setBackendErrorVisible] = useState(false);
  const [backendErrorText, setBackendErrorText] = useState('');

  // called with results of react_change_password endpoint
  //if password change was a success, navigate to home; otherwise, show error from backend
  function attemptPasswordChange(the_json) {
    setCurrentPasswordErrorVisible(false);
    setNewPassword1ErrorVisible(false);
    setNewPassword2ErrorVisible(false);
    setScreenNameErrorVisible(false);
    setBackendErrorVisible(false);
    let success = the_json["status"] === "success";
    let message = the_json["message"];
    if(success) {
      navigate('/home/'+username);
    }
    else {
      setBackendErrorText(message);
      setBackendErrorVisible(true);
    }
  }

  // called when 'Update' button for password field is clicked
  // if any fields are blank, show error for that field
  // call react_change_password endpoint and pass the results to attemptPasswordChange
  function handlePasswordClick() {
    currentPassword.length === 0 ? setCurrentPasswordErrorVisible(true) : setCurrentPasswordErrorVisible(false);
    newPassword1.length === 0 ? setNewPassword1ErrorVisible(true) : setNewPassword1ErrorVisible(false);
    newPassword2.length === 0 ? setNewPassword2ErrorVisible(true) : setNewPassword2ErrorVisible(false);
    if(currentPassword.length > 0 && newPassword1.length > 0 && newPassword2.length > 0) {
      let url = "/accounts/react_change_password/"+username+"/"+currentPassword+"/"+newPassword1+"/"+newPassword2;
      fetch(url)
          .then( response => response.json())
          .then(the_json => attemptPasswordChange(the_json))
          .catch(error => console.error('Error fetching player password change: ', error));
    }
  }

  // called when 'Update' button for screen name/ship color field is clicked
  // if screen name field is blank, show error; otherwise, call change-player-preferences endpoint and navigate to home
  function handleScreenNameColorClick() {
    screenName.length === 0 ? setScreenNameErrorVisible(true) : setScreenNameErrorVisible(false);
    if(screenName.length > 0) {
      let url = "/change-player-preferences/"+username+"/"+screenName+"/"+color.substring(color.indexOf("#")+1);
      fetch(url)
        .then(navigate('/home/'+username))
        .catch(error => console.error('Error fetching player preferences change: ', error));
    }
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
            <label className="errorLabel" style={{display: backendErrorVisible ? "block" : "none"}}>{backendErrorText}</label>
            <button onClick={handlePasswordClick}>Update</button><br />
            
            Screen Name
            <TextFieldWithError value={screenName} setValue={setScreenName} errorVisible={screenNameErrorVisible}/>
            Ship Color
            <input type="color" 
                id="color"
                name="color"
                value={color}
                onChange={(ev) => setColor(ev.target.value)}
                style={{marginLeft: '1em'}} /><br />
            <button onClick={handleScreenNameColorClick}>Update</button><br />
        </div>
      </main>
    </div>
  );
}


export default ProfilePage
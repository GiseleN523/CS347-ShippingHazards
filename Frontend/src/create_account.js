/*
  Page where user can create an account
  Reached by clicking on the 'Create Account' button on the login page
  User types in username, then password twice
  'Submit' button and 'Back' button that takes them back to the login screen
  If username was already typed in login page, it is passed in the url and filled in automatically
*/

import React, { useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import './login.css';
import TextFieldWithError from './text_field_with_error';

// fillerUsername is the username (potentially) typed by the user in the 'Username' field of the login page
// This is to make it easier if user has already filled in that field once before pressing 'Create Account'
let fillerUsername;

function AccountCreationFields() {

  const [username, setUsername] = useState(fillerUsername);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [screenName, setScreenName] = useState('');

  // errors set by the frontend if a field isn't filled in
  const [usernameErrorVisible, setUsernameErrorVisible] = useState(false);
  const [password1ErrorVisible, setPassword1ErrorVisible] = useState(false);
  const [password2ErrorVisible, setPassword2ErrorVisible] = useState(false);
  const [screenNameErrorVisible, setScreenNameErrorVisible] = useState(false);

  // custom error sent by the backend if a field is invalid
  const [backendErrorVisible, setBackendErrorVisible] = useState(false);
  const [backendErrorText, setBackendErrorText] = useState('');

  const navigate = useNavigate();

  // called with the results of react_signup endpoint
  //if account creation was a success, navigate to home; otherwise, show error from backend
  function attemptCreation(the_json) {
    setUsernameErrorVisible(false);
    setPassword1ErrorVisible(false);
    setPassword2ErrorVisible(false);
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

  // called when 'Submit' button is clicked
  // if any fields are blank, show error for that field
  // otherwise, call react_signup endpoint and pass the results to attemptCreation
  const onSubmitButtonClick = () => {
    if(username.length === 0 || password1.length === 0 || password2.length === 0 || screenName.length === 0) {
      setUsernameErrorVisible(username.length === 0);
      setPassword1ErrorVisible(password1.length === 0);
      setPassword2ErrorVisible(password2.length === 0);
      setScreenNameErrorVisible(username.length === 0);
    }
    else {
      let url = "/accounts/react_signup/"+username+"/"+password1+"/"+password2+"/"+screenName;
      fetch(url)
        .then( response => response.json())
        .then(the_json => attemptCreation(the_json))
        .catch(error => console.error('Error fetching account creation/signup: ', error));
    }
  }

  return (
    <div>
      <TextFieldWithError placeholder={"Username"} value={username} setValue={setUsername} errorVisible={usernameErrorVisible}/>
      <TextFieldWithError password={true} placeholder={"Password"} value={password1} setValue={setPassword1} errorVisible={password1ErrorVisible}/>
      <TextFieldWithError password={true} placeholder={"Retype password"} value={password2} setValue={setPassword2} errorVisible={password2ErrorVisible}/>
      <TextFieldWithError placeholder={"Screen name"} value={screenName} setValue={setScreenName} errorVisible={screenNameErrorVisible}/>
      <label className="errorLabel" style={{display: backendErrorVisible ? "block" : "none"}}>{backendErrorText}</label>
      <div className="inputContainer">
          <input className= "inputButton" type="button" onClick={() => navigate('/')} value={'\u21A9 Back'} />
          <input id="submitButton" className= "inputButton" type="button" onClick={onSubmitButtonClick} value={'Submit'} />
        </div>
    </div>
  );
}

function AccountCreation() {

  ({fillerUsername} = useParams());

  // if Enter key is pressed, click the Submit button automatically
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("submitButton").click();
    }
  }

  return (
    <div className="mainContainer" onKeyDown={handleKeyDown}>
      <div className= 'loginContainer'>
        <div className= "gametitle">
          <div>BATTLESHIP</div>
        </div>
        <div className= "titleContainer">Create Account</div>
        <AccountCreationFields />
      </div>
    </div>
  )
}

export default AccountCreation
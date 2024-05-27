import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import './login.css';
import lobbyMusic from './sounds/lobbyMusic.mp3';
import TextFieldWithError from './text_field_with_error';

function LoginFields() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // errors set by frontend if field is empty
  const [usernameErrorVisible, setUsernameErrorVisible] = useState(false);
  const [passwordErrorVisible, setPasswordErrorVisible] = useState(false);

  // custom error sent by backend if login info is invalid
  const [backendErrorVisible, setBackendErrorVisible] = useState(false);
  const [backendErrorText, setBackendErrorText] = useState('');

  const navigate = useNavigate();

  // called with results of react_login endpoint
  //if login was a success, navigate to home; otherwise, show error from backend
  function attemptLogin(the_json) {
    setUsernameErrorVisible(false);
    setPasswordErrorVisible(false);
    setBackendErrorVisible(false);
    let success = the_json["status"] === "success";
    let message = the_json["message"];
    if(success) {
      navigate('/home/'+username);
      // only play audio if login is a success
      const audio = new Audio(lobbyMusic);
      audio.loop = true;
      audio.play(); 
    }
    else {
      setBackendErrorText(message);
      setBackendErrorVisible(true);
    }
  }

  // called when 'Submit' button is clicked
  // if any fields are blank, show error for that field; otherwise, call react_login endpoint and pass results to attemptLogin
  const onSubmitButtonClick = () => {
    if(username.length === 0 || password.length === 0) {
      // If username or password is empty, set error messages accordingly
      setUsernameErrorVisible(username.length === 0);
      setPasswordErrorVisible(password.length === 0);
    }
    else {
      let url = "accounts/react_login/"+username+"/"+password;
      fetch(url)
        .then( response => response.json())
        .then(the_json => attemptLogin(the_json));
    }
  }

  return (
    <div>
      <TextFieldWithError placeholder={"Username"} value={username} setValue={setUsername} errorVisible={usernameErrorVisible}/>
      <TextFieldWithError password={true} placeholder={"Password"} value={password} setValue={setPassword} errorVisible={passwordErrorVisible}/>
      <label className="errorLabel" style={{display: backendErrorVisible ? "block" : "none"}}>{backendErrorText}</label>
      <div className="inputContainer">
        <input id="loginButton" className= "inputButton" type="button" onClick={onSubmitButtonClick} value={'Submit'} />
        <input className= "inputButton" type="button" onClick={() => navigate('/createaccount/'+username)} value={'Create Account'} />
      </div>
    </div>
  );
}

function Login() {

  // if Enter key is pressed, click the Submit button automatically
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("loginButton").click();
    }
  }

  return (
    <div className="mainContainer" onKeyDown={handleKeyDown}>
      <div className= 'loginContainer'>
        <div className= "gametitle">
          <div>BATTLESHIP</div>
        </div>
        <div className= "titleContainer">Login</div>
        <LoginFields />
      </div>
    </div>
  )
}

export default Login;
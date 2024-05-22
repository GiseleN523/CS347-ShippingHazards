import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import './login.css'
import lobbyMusic from './sounds/lobbyMusic.mp3';
import TextFieldWithError from './text_field_with_error';

function LoginFields() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErrorVisible, setUsernameErrorVisible] = useState(false);
  const [passwordErrorVisible, setPasswordErrorVisible] = useState(false);
  const [backendErrorVisible, setBackendErrorVisible] = useState(false);
  const [backendErrorText, setBackendErrorText] = useState('');
  const navigate = useNavigate();

  function attemptLogin(the_json) {
    setUsernameErrorVisible(false);
    setPasswordErrorVisible(false);
    setBackendErrorVisible(false);
    let success = the_json["status"] == "success";
    let message = the_json["message"];
    if(success) { // If both username and password are provided, navigate to "/home"
      navigate('/home/'+username);
    }
    else {
      setBackendErrorText(message);
      setBackendErrorVisible(true);
    }
  }

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

      const audio = new Audio(lobbyMusic);
      audio.loop = true;
      audio.play(); 
    }
  }

  return (
    <div>
      <TextFieldWithError placeholder={"Username"} value={username} setValue={setUsername} errorVisible={usernameErrorVisible}/>
      <TextFieldWithError password={true} placeholder={"Password"} value={password} setValue={setPassword} errorVisible={passwordErrorVisible}/>
      <label className="errorLabel" style={{display: backendErrorVisible ? "block" : "none"}}>{backendErrorText}</label>
      <div className="inputContainer">
        <input className= "inputButton" type="button" onClick={onSubmitButtonClick} value={'Submit'} />
        <input className= "inputButton" type="button" onClick={() => navigate('/createaccount/'+username)} value={'Create Account'} />
      </div>
    </div>
  );
}

function Login() {
  return (
    <div className="mainContainer">
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
import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import './login.css'
import lobbyMusic from './sounds/lobbyMusic.mp3';




function TextInputField({password, placeholder, value, setValue, errorVisible}) {
  return (
    <div className="inputContainer">
      <input
        type={password ? "password" : "text"}
        value={value}
        placeholder={placeholder}
        onChange={(ev) => setValue(ev.target.value)}
        className="inputBox"
      />
      <label className="errorLabel" style={{display: errorVisible ? "block" : "none"}}>{placeholder + " is required"}</label>
    </div>
  );
}

function LoginFields({setShowAccountCreation, navigate}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErrorVisible, setUsernameErrorVisible] = useState('');
  const [passwordErrorVisible, setPasswordErrorVisible] = useState('');
  const [errorText, setErrorText] = useState(''); //general error coming from backend

  function attemptLogin(the_json) {
    setUsernameErrorVisible(false);
    setPasswordErrorVisible(false);
    let success = the_json["status"] == "success";
    let message = the_json["message"];
    if(success) { // If both username and password are provided, navigate to "/home"
      navigate('/home/'+username);
    }
    else {
      setErrorText(message);
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

  const onCreateAccountButtonClick = () => {
    setShowAccountCreation(true);
  }
  return (
    <div>
      <TextInputField placeholder={"Username"} value={username} setValue={setUsername} errorVisible={usernameErrorVisible}/>
      <TextInputField password={true} placeholder={"Password"} value={password} setValue={setPassword} errorVisible={passwordErrorVisible}/>
      <label className="errorLabel">{errorText}</label><br />
      <div className="inputContainer">
        <input className= "inputButton" type="button" onClick={onSubmitButtonClick} value={'Submit'} />
        <input className= "inputButton" type="button" onClick={onCreateAccountButtonClick} value={'Create Account'} />
      </div>
    </div>
  );
}

function AccountCreationFields({setShowAccountCreation, navigate}) {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [screenName, setScreenName] = useState('');
  const [usernameErrorVisible, setUsernameErrorVisible] = useState('');
  const [password1ErrorVisible, setPassword1ErrorVisible] = useState('');
  const [password2ErrorVisible, setPassword2ErrorVisible] = useState('');
  const [screenNameErrorVisible, setScreenNameErrorVisible] = useState('');
  const [errorText, setErrorText] = useState('');
  function attemptCreation(the_json) {
    let success = the_json["status"] == "success";
    let message = the_json["message"];
    if(success) {
      navigate('/home/'+username);
    }
    else {
      setErrorText(message);
    }
  }
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
        .then(the_json => attemptCreation(the_json));
    }
    
  }
  return (
    <div>
      <TextInputField placeholder={"Username"} value={username} setValue={setUsername} errorVisible={usernameErrorVisible}/>
      <TextInputField password={true} placeholder={"Password"} value={password1} setValue={setPassword1} errorVisible={password1ErrorVisible}/>
      <TextInputField password={true} placeholder={"Retype password"} value={password2} setValue={setPassword2} errorVisible={password2ErrorVisible}/>
      <TextInputField placeholder={"Screen name"} value={screenName} setValue={setScreenName} errorVisible={screenNameErrorVisible}/>
      <label className="errorLabel">{errorText}</label><br />
      <div className="inputContainer">
          <input className= "inputButton" type="button" onClick={() => setShowAccountCreation(false)} value={'\u21A9 Back'} />
          <input className= "inputButton" type="button" onClick={onSubmitButtonClick} value={'Submit'} />
        </div>
    </div>
  );
}

const Login = () => {
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="mainContainer">
      <div className= 'loginContainer'>
        <div className= "gametitle">
          <div> BATTLESHIP</div>
        </div>
        <div className= "titleContainer">
          <div>{showAccountCreation ? "Create Account" : "Login"}</div>
        </div>
        {showAccountCreation ? <AccountCreationFields setShowAccountCreation={setShowAccountCreation} navigate={navigate}/> : <LoginFields setShowAccountCreation={setShowAccountCreation} navigate={navigate}/>}
      </div>
    </div>
  )
}

export default Login
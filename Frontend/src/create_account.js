import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import './login.css';
import TextFieldWithError from './text_field_with_error';
import { useParams } from 'react-router-dom';

let fillerUsername;

function AccountCreation() {
    ({fillerUsername} = useParams());
    return (
      <div className="mainContainer">
        <div className= "loginContainer">
          <div className= "gametitle">
            <div>BATTLESHIP</div>
          </div>
          <div className= "titleContainer">Create Account</div>
          <AccountCreationFields />
        </div>
      </div>
    )
}

function AccountCreationFields() {

    const [username, setUsername] = useState(fillerUsername);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [screenName, setScreenName] = useState('');
    const [usernameErrorVisible, setUsernameErrorVisible] = useState(false);
    const [password1ErrorVisible, setPassword1ErrorVisible] = useState(false);
    const [password2ErrorVisible, setPassword2ErrorVisible] = useState(false);
    const [screenNameErrorVisible, setScreenNameErrorVisible] = useState(false);
    const [backendErrorVisible, setBackendErrorVisible] = useState(false);
    const [backendErrorText, setBackendErrorText] = useState('');
    const navigate = useNavigate();

    function attemptCreation(the_json) {
      setUsernameErrorVisible(false);
      setPassword1ErrorVisible(false);
      setPassword2ErrorVisible(false);
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
        <TextFieldWithError placeholder={"Username"} value={username} setValue={setUsername} errorVisible={usernameErrorVisible}/>
        <TextFieldWithError password={true} placeholder={"Password"} value={password1} setValue={setPassword1} errorVisible={password1ErrorVisible}/>
        <TextFieldWithError password={true} placeholder={"Retype password"} value={password2} setValue={setPassword2} errorVisible={password2ErrorVisible}/>
        <TextFieldWithError placeholder={"Screen name"} value={screenName} setValue={setScreenName} errorVisible={screenNameErrorVisible}/>
        <label className="errorLabel" style={{display: backendErrorVisible ? "block" : "none"}}>{backendErrorText}</label>
        <div className="inputContainer">
            <input className= "inputButton" type="button" onClick={() => navigate('/')} value={'\u21A9 Back'} />
            <input className= "inputButton" type="button" onClick={onSubmitButtonClick} value={'Submit'} />
          </div>
      </div>
    );
  }
  
  export default AccountCreation;
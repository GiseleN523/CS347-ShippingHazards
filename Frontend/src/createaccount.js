import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import './login.css'

const CreateAccount = () => {
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [screenName, setScreenName] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password1Error, setPassword1Error] = useState('')
  const [password2Error, setPassword2Error] = useState('')
  const [screenNameError, setScreenNameError] = useState('')

  const navigate = useNavigate()

  function attemptCreation(the_json) {
    let success = the_json["status"] == "success";
    let message = the_json["message"];
    if(email && password1 && password2 && screenName && success === true) {
      navigate('/home/'+email);
    }
    else if (email && password1 && password2 && screenName && success === false) { // If both email and password are provided, navigate to "/home"
      alert(message);
    } 
    else {
      // If email or password is empty, set error messages accordingly
      setEmailError(email? '' : 'Email is required');
      setPassword1Error(password1? '' : 'Password is required');
      setPassword2Error(password2? '' : 'Retyping password is required');
      setScreenNameError(screenName? '' : 'Screen name is required');
    }
  }

  const onButtonClick = () => {
    let url = "/accounts/react_signup/"+email+"/"+password1+"/"+password2+"/"+screenName;
    fetch(url)
      .then( response => response.json())
      .then(the_json => attemptCreation(the_json));
  }

  return (
    <div className="mainContainer">
      <div className= 'loginContainer'>
        <div className= "gametitle">
          <div> BATTLESHIP</div>
        </div>
        <div className= "titleContainer">
          <div>Create Account</div>
        </div>
        <br />
        <div className="inputContainer">
          <input
            value={email}
            placeholder="Username"
            onChange={(ev) => setEmail(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="password"
            value={password1}
            placeholder="Password"
            onChange={(ev) => setPassword1(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{password1Error}</label>
        </div>
        <div className="inputContainer">
          <input
            type="password"
            value={password2}
            placeholder="Retype your password"
            onChange={(ev) => setPassword2(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{password2Error}</label>
        </div>
        <div className="inputContainer">
          <input
            type="text"
            value={screenName}
            placeholder="Screen name"
            onChange={(ev) => setScreenName(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{screenNameError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input className= "inputButton" type="button" onClick={onButtonClick} value={'Continue'} />
        </div>
      </div>
    </div>
  )
}

export default CreateAccount
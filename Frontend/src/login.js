import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import './login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  function attemptLogin(the_json) {
    let success = the_json["status"] == "success";
    let message = the_json["message"];
    if(email && password && success === true) {
      navigate('/home/'+email);
    }
    else if (email && password && success === false) { // If both email and password are provided, navigate to "/home"
      alert(message);
    } 
    else {
      // If email or password is empty, set error messages accordingly
      setEmailError(email? '' : 'Email is required');
      setPasswordError(password? '' : 'Password is required');
    }
  }

  const onContinueButtonClick = () => {
    let url = "accounts/react_login/"+email+"/"+password;
    fetch(url)
      .then( response => response.json())
      .then(the_json => attemptLogin(the_json));
  }

  const onCreateAccountButtonClick = () => {
    navigate('/createaccount/');
  }

  return (
    <div className="mainContainer">
      <div className= 'loginContainer'>
        <div className= "gametitle">
          <div> BATTLESHIP</div>
        </div>
        <div className= "titleContainer">
          <div>Login</div>
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
            value={password}
            placeholder="Password"
            onChange={(ev) => setPassword(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input className= "inputButton" type="button" onClick={onContinueButtonClick} value={'Continue'} />
          <input className= "inputButton" type="button" onClick={onCreateAccountButtonClick} value={'Create Account'} />
        </div>
      </div>
    </div>
  )
}

export default Login
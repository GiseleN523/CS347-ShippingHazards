import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import './login.css'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    if (email && password) { // If both email and password are provided, navigate to "/home"
      navigate('/home/'+email);
    } else {
      // If email or password is empty, set error messages accordingly
      setEmailError(email? '' : 'Email is required');
      setPasswordError(password? '' : 'Password is required');
    }
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
            value={password}
            placeholder="Password"
            onChange={(ev) => setPassword(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input className= "inputButton" type="button" onClick={onButtonClick} value={'Continue'} />
        </div>
      </div>
    </div>
  )
}

export default Login
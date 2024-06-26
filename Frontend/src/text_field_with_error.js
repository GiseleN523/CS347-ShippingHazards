/*
  A text input field (or password if password parameter is true) with an associated error message
  errorVisible state controls whether the error message is visible
  If no errorMessage is given, the error message is placeholder + " is required"
  If no placeholder is given, the error mssage is "This field is required"
*/

import './text_field_with_error.css'

function TextFieldWithError({password, placeholder="", value, setValue, errorVisible, errorMessage=placeholder.length > 0 ? placeholder+" is required" : "This field is required"}) {
  return (
    <div className="inputContainer">
      <input
        type={password ? "password" : "text"}
        value={value}
        placeholder={placeholder}
        onChange={(ev) => setValue(ev.target.value)}
        className="inputBox"
      />
      <label className="errorLabel" style={{display: errorVisible ? "block" : "none"}}>{errorMessage}</label>
    </div>
  );
}

export default TextFieldWithError;
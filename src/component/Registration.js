import React, { useState, useContext } from "react";
import Axios from "axios";
import "../style/forms.css";
import "../style/speech-bubble.css";
import TextField from "@material-ui/core/TextField";
import { LoggedInContext } from "../context/LoggedInContext";

function Registration() {
  if (localStorage.getItem("username") != null){
    window.location.href = "/";
  }

  const regRoute = "http://localhost:8080/user/registration";
  const [localDate, setLocalDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [mistypedPassword, setMistypedPassword] = useState(false);
  const [missingInputs, setMissingInputs] = useState(false);
  const [eyeSrc, setEyeSrc] = useState("/images/eyes-closed.svg");
  const [eyeSrc2, setEyeSrc2] = useState("/images/eyes-closed.svg");
  const [passwordInputType,setPasswordInputType] = useState("password");
  const [password2InputType,setPassword2InputType] = useState("password");
  const [passwordIsTooSmall, setPasswordIsTooSmall] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(true);

  const [, setIsLoggedIn] = useContext(LoggedInContext);

  const [inputStates, setInputStates] = useState({
    fname: "",
    lname: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const handleEnterKeydown = (event) => {
    if (event.keyCode === 13){
      sendUserRegistrationData();
    }
  }

  const checkEmailValidity = (newEmail) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(newEmail === "" ? inputStates.email : newEmail).toLowerCase());
  }

  const sendUserRegistrationData = () => {
    if (inputStates.password !== inputStates.password2){
      setMistypedPassword(true);
    } else {
      setMistypedPassword(false);
    }

    if (inputStates.password.length < 5){
      setPasswordIsTooSmall(true);
    } else {
      setPasswordIsTooSmall(false);
    }

    if(!checkEmailValidity("")){
      setEmailIsValid(false);
    } else {
      setEmailIsValid(true);
    }

    //checks if everything is filled
    if (inputStates.fname !== "" && inputStates.lname !== "" 
      && inputStates.userName !== "" && inputStates.password !== "" && inputStates.email !== ""
      && inputStates.phone !== "" && localDate !== ""){
        //checks if everything is filled correctly
        if (!mistypedPassword && !passwordIsTooSmall && emailIsValid){
          Axios.post(
            regRoute,
            {
              firstName: inputStates.fname,
              lastName: inputStates.lname,
              userName: inputStates.userName,
              password: inputStates.password,
              birthday: localDate,
              email: inputStates.email,
              phoneNumber: inputStates.phone,
            },
            { withCredentials: true }
          )
          .then(function (response) {
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("roles", response.data.roles);
            setIsLoggedIn(true);
            window.location.href = "/";
          })
          .catch(function (error) {
            console.log(error);
          });
        }
    } else {
      setMissingInputs(true);
    }
  };

  const changeToClosedSrc = (passwordNum) => {
    if (passwordNum === 1){
      setEyeSrc("/images/eyes-closed.svg");
      setPasswordInputType("password");
    } else {
      setEyeSrc2("/images/eyes-closed.svg");
      setPassword2InputType("password");
    }
  };

  const changeToOpenSrc = (passwordNum) => {
    if (passwordNum === 1){
      setEyeSrc("/images/eyes-open.svg");
      setPasswordInputType("text")
    } else {
      setEyeSrc2("/images/eyes-open.svg");
      setPassword2InputType("text");
    }
  };

  function checkMissingInputs(inputName){
    for (let [key, value] of Object.entries(inputStates)) {
      if (inputName !== key && value === ""){
        return;
      }
    }
    setMissingInputs(false);
  }

  function handleChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (missingInputs && value !== ""){
      checkMissingInputs(e.target.name);
    }
  }

  function handleEmailChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (checkEmailValidity(value)){
      setEmailIsValid(true);
    }
  }

  function handlePasswordChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (e.target.name === "password"){
      if (passwordIsTooSmall && value.length >= 5){
        setPasswordIsTooSmall(false);
      }
      if (mistypedPassword && value === inputStates.password2){
        setMistypedPassword(false);
      }
    } else if (mistypedPassword && value === inputStates.password){
      setMistypedPassword(false);
    }
    if (missingInputs && value !== ""){
      checkMissingInputs(e.target.name);
    }
  }

  return (
    <div className="forms">
      <div className="form-fields">
        <label className="labels" htmlFor="usern">
          Username:
        </label>
        <input
          className="inputs"
          type="text"
          id="usern"
          placeholder="tsmith"
          value={inputStates.userName}
          name="userName"
          onChange={handleChange}
          onKeyDown={handleEnterKeydown}
        ></input>

        <label className="labels" htmlFor="fname">
          First name:
        </label>
        <input
          className="inputs"
          type="text"
          id="fname"
          placeholder="Thomas"
          value={inputStates.fname}
          name="fname"
          onChange={handleChange}
          onKeyDown={handleEnterKeydown}
        ></input>

        <label className="labels" htmlFor="lname">
          Last name:
        </label>
        <input
          className="inputs"
          type="text"
          id="lname"
          placeholder="Smith"
          value={inputStates.lname}
          name="lname"
          onChange={handleChange}
          onKeyDown={handleEnterKeydown}
        ></input>

        <label className="labels" htmlFor="email">
          E-mail: {emailIsValid ? null : <p style={{color: "red", margin: "0", marginLeft: "1rem"}}>Invalid</p>}
        </label>
        <input
          className="inputs"
          type="text"
          id="email"
          placeholder="tsmith@email.com"
          value={inputStates.email}
          name="email"
          onChange={handleEmailChange}
          onKeyDown={handleEnterKeydown}
        ></input>

        <label className="labels" htmlFor="date">
          Birthday:
        </label>
        <div className="calendar">
          <TextField
            id="date"
            type="date"
            InputProps={{
              inputProps: {
                min: "1900-01-01",
                max: new Date().toISOString().slice(0, 10),
              },
            }}
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <label className="labels" htmlFor="phone">
          Phone Number:
        </label>
        <input
          className="inputs"
          type="text"
          id="phone"
          placeholder="02011111111"
          value={inputStates.phone}
          name="phone"
          onChange={handleChange}
          onKeyDown={handleEnterKeydown}
        ></input>

        <label className="labels" htmlFor="password">
          Password: (<p style={{color: `${passwordIsTooSmall ? "red" : "black"}`, margin: 0}}>at least 5 characters!</p>)
        </label>
        <div style={{display: "inline-flex", width: "64rem"}}>
          <input
            style={{backgroundColor: `${mistypedPassword ? "red" : "white"}` }}
            className="password-inputs"
            type={passwordInputType}
            id="password"
            placeholder="password"
            value={inputStates.password}
            name="password"
            onChange={handlePasswordChange}
            onKeyDown={handleEnterKeydown}
          ></input>
          <button
            style={{
              width: "3vw",
              height: "2vw",
              padding: "0",
              border: "0",
              borderRadius: "40%",
              outline: "none",
              cursor: "pointer",
              margin: "auto",
              marginLeft: "1em"
            }}
            onMouseDown={() => {changeToOpenSrc(1)}}
            onMouseUp={() => {changeToClosedSrc(1)}}
            onMouseOut={() => {changeToClosedSrc(1)}}
          >
            <img
              src={eyeSrc}
              alt="see password"
              style={{ width: "2.5vw", height: "2vw" }}
            />
          </button>
        </div>
        
        <label className="labels" htmlFor="password2">
          Password Again:
        </label>
        <div style={{display: "inline-flex", width: "64rem"}}>
          <input
            style={{backgroundColor: `${mistypedPassword ? "red" : "white"}` }}
            className="password-inputs"
            type={password2InputType}
            id="password2"
            placeholder="password (again)"
            value={inputStates.password2}
            name="password2"
            onChange={handlePasswordChange}
            onKeyDown={handleEnterKeydown}
          ></input>
          <button
            style={{
              width: "3vw",
              height: "2vw",
              padding: "0",
              border: "0",
              borderRadius: "40%",
              outline: "none",
              cursor: "pointer",
              margin: "auto",
              marginLeft: "1em"
            }}
            onMouseDown={() => {changeToOpenSrc(2)}}
            onMouseUp={() => {changeToClosedSrc(2)}}
            onMouseOut={() => {changeToClosedSrc(2)}}
          >
            <img
              src={eyeSrc2}
              alt="see password"
              style={{ width: "2.5vw", height: "2vw" }}
            />
          </button>
        </div>
        {mistypedPassword ? <p style={{textAlign: "center"}}>The given passwords doesn't match!</p> : null}
        {missingInputs ? <p className="speech-bubble">You need to fill all input fields to Register!</p> : null}
        <button className="buttons" onClick={sendUserRegistrationData}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Registration;

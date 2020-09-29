import React, { useState, useContext } from "react";
import Axios from "axios";
import "../style/forms.css";
import TextField from "@material-ui/core/TextField";
import { LoggedInContext } from "../context/LoggedInContext";

function Registration() {
  const regRoute = "http://localhost:8080/user/registration";
  const [localDate, setLocalDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [, setIsLoggedIn] = useContext(LoggedInContext);

  const sendUserRegistrationData = () => {
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
  };

  const [inputStates, setInputStates] = useState({
    fname: "",
    lname: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
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
        ></input>

        <label className="labels" htmlFor="email">
          E-mail:
        </label>
        <input
          className="inputs"
          type="text"
          id="email"
          placeholder="tsmith@email.com"
          value={inputStates.email}
          name="email"
          onChange={handleChange}
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
        ></input>

        <label className="labels" htmlFor="password">
          Password:
        </label>
        <input
          className="inputs"
          type="password"
          id="password"
          placeholder="password"
          value={inputStates.password}
          name="password"
          onChange={handleChange}
        ></input>
        <br />
        <button className="buttons" onClick={sendUserRegistrationData}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Registration;

import React, { useState } from "react";
import Axios from "axios";
import "../style/forms.css";
import TextField from "@material-ui/core/TextField";

function Registration() {
  const regRoute = "http://localhost:8080/registration";

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

  const sendUserRegistrationData = () => {
    Axios.post(regRoute, {
      firstName: inputStates.fname,
      lastName: inputStates.lname,
      userName: inputStates.userName,
      password: inputStates.password,
      birthday: localDate,
      email: inputStates.email,
      phoneNumber: inputStates.phone,
    })
      .then(function (response) {
        console.log(response);

        window.location.href = "/";
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [localDate, setLocalDate] = useState("2020-09-25");
  console.log(localDate);

  return (
    <div className="forms">
      <div className="form-fields">
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

        <label className="labels" htmlFor="usern">
          userName:
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

        <div className="calendar">
          <TextField
            id="date"
            label="Birthday:"
            type="date"
            InputProps={{ inputProps: { min: "1980-01-01" } }}
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

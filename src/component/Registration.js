import React, { useState, useContext } from "react";
import Axios from "axios";
import "../style/forms.css";
import "../style/speech-bubble.css";
import { LoggedInContext } from "../context/LoggedInContext";
import moment from "moment";

function Registration() {
  if (localStorage.getItem("username") != null) {
    window.location.href = "/";
  }

  const regRoute = "http://localhost:8080/user/registration";
  const checkEmailRoute = "http://localhost:8080/user/check-email";
  const checkUserNameRoute = "http://localhost:8080/user/check-username";
  const checkPhoneNumberRoute = "http://localhost:8080/user/check-phone";

  const [eyeSrc, setEyeSrc] = useState("/images/eyes-closed.svg");
  const [eyeSrc2, setEyeSrc2] = useState("/images/eyes-closed.svg");
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [password2InputType, setPassword2InputType] = useState("password");

  const [mistypedPassword, setMistypedPassword] = useState(false);
  const [missingInputs, setMissingInputs] = useState(false);
  const [passwordIsTooSmall, setPasswordIsTooSmall] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [birthdayIsValid, setBirthdayIsValid] = useState(true);
  const [birthdayIsInRange, setBirthdayIsInRange] = useState(true);
  const [unnkownError, setUnnkownError] = useState(false);
  const [emailIsUnique, setEmailIsUnique] = useState(true);
  const [phoneNumberIsUnique, setPhoneNumberIsUnique] = useState(true);
  const [userNameIsUnique, setUserNameIsUnique] = useState(true);
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [birthdayYear, setBirthdayYear] = useState("");

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
    if (event.keyCode === 13) {
      sendUserRegistrationData();
    }
  }

  const checkEmailValidity = (newEmail) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(newEmail === "" ? inputStates.email : newEmail).toLowerCase());
  }

  const checkIfFieldsAreFilled = () => {
    return inputStates.fname !== "" && inputStates.lname !== ""
      && inputStates.userName !== "" && inputStates.password !== "" && inputStates.password2 !== ""
      && inputStates.email !== "" && inputStates.phone !== "";
  }

  //and set the states according to it
  const checkIfFieldsAreFilledCorrectly = () => {
    let somethingIsWrong = false;
    if (inputStates.password !== inputStates.password2) {
      setMistypedPassword(true);
      somethingIsWrong = true;
    } else {
      setMistypedPassword(false);
    }

    if (inputStates.password.length < 5) {
      setPasswordIsTooSmall(true);
      somethingIsWrong = true;
    } else {
      setPasswordIsTooSmall(false);
    }

    if (!checkEmailValidity("")) {
      setEmailIsValid(false);
      somethingIsWrong = true;
    } else {
      setEmailIsValid(true);
    }

    if (checkBirthdayValidityCasually()) {
      if (!checkBirthdayIsInRangeCasually()) {
        somethingIsWrong = true;
      }
    } else {
      somethingIsWrong = true;
    }

    if (!(userNameIsUnique && emailIsUnique && phoneNumberIsUnique)) {
      somethingIsWrong = true;
    }

    if (somethingIsWrong) {
      return false;
    } else {
      return true;
    }
  }

  const sendUserRegistrationData = () => {
    //need to call this separately, because it'll set the error states according to that
    let everythingIsCorrect = checkIfFieldsAreFilledCorrectly();

    // checks if everything is filled
    if (checkIfFieldsAreFilled()) {
      if (everythingIsCorrect) {
        Axios.post(
          regRoute,
          {
            firstName: inputStates.fname,
            lastName: inputStates.lname,
            userName: inputStates.userName,
            password: inputStates.password,
            birthday: (birthdayYear + "-" + birthdayMonth + "-" + birthdayDay),
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
          })
          .catch(function (error) {
            handleErrors(error);
          });
      }
    } else {
      setMissingInputs(true);
    }
  };

  const handleErrors = (error) => {
    if (error.response.status === 400) {
      if (error.response.data.nullableError != null) {
        setMissingInputs(true);
      } else if (error.response.data.emailValidityError != null) {
        setEmailIsValid(false);
      } else if (error.response.data.emailUniquenessError != null) {
        setEmailIsUnique(false);
      } else if (error.response.data.phoneNumberUniquenessError != null) {
        setPhoneNumberIsUnique(false);
      } else if (error.response.data.userNameUniquenessError != null) {
        setUserNameIsUnique(false);
      } else if (error.response.data.birthDayOutOfRangeError != null) {
        setBirthdayIsValid(false); //more precisely it is out of range, but nvm
      }
      setUnnkownError(false);
    } else {
      setUnnkownError(true);
    }
  }

  const changeToClosedSrc = (passwordNum) => {
    if (passwordNum === 1) {
      setEyeSrc("/images/eyes-closed.svg");
      setPasswordInputType("password");
    } else {
      setEyeSrc2("/images/eyes-closed.svg");
      setPassword2InputType("password");
    }
  };

  const changeToOpenSrc = (passwordNum) => {
    if (passwordNum === 1) {
      setEyeSrc("/images/eyes-open.svg");
      setPasswordInputType("text")
    } else {
      setEyeSrc2("/images/eyes-open.svg");
      setPassword2InputType("text");
    }
  };

  function checkMissingInputs(inputName) {
    for (let [key, value] of Object.entries(inputStates)) {
      if (inputName !== key && value === "") {
        return;
      }
    }
    setMissingInputs(false);
  }

  function handleInputChangeCasual(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (missingInputs && value !== "") {
      checkMissingInputs(e.target.name);
    }
  }

  function handleBirthdayChange(e) {
    const value = e.currentTarget.value;
    if (e.currentTarget.name === "month") {
      setBirthdayMonth(value);
      if (!birthdayIsValid) {
        let validity = checkBirthdayValidity(value, "month");
        setBirthdayIsValid(validity);
        if (validity) {
          setBirthdayIsInRange(checkBirthdayIsInRange(value, "month"));
        }
      } else if (!birthdayIsInRange) {
        setBirthdayIsInRange(checkBirthdayIsInRange(value, "month"));
      }
    } else if (e.currentTarget.name === "day") {
      setBirthdayDay(value);
      if (!birthdayIsValid) {
        let validity = checkBirthdayValidity(value, "day");
        setBirthdayIsValid(validity);
        if (validity) {
          setBirthdayIsInRange(checkBirthdayIsInRange(value, "day"));
        }
      } else if (!birthdayIsInRange) {
        setBirthdayIsInRange(checkBirthdayIsInRange(value, "day"));
      }
    } else {
      setBirthdayYear(value);
      if (!birthdayIsValid) {
        let validity = checkBirthdayValidity(value, "year");
        setBirthdayIsValid(validity);
        if (validity) {
          setBirthdayIsInRange(checkBirthdayIsInRange(value, "year"));
        }
      } else if (!birthdayIsInRange) {
        setBirthdayIsInRange(checkBirthdayIsInRange(value, "year"));
      }
    }
  }

  //and sets it as well -- only check if its in range if its valid in the first place (do not display error either)
  const checkBirthdayIsInRangeCasually = () => {
    if (birthdayMonth === "" && birthdayDay === "" && birthdayYear === "") {
      setBirthdayIsInRange(true);
      return true;
    }

    let today = new Date();
    let dd = today.getDate().toString();
    if (dd.length === 1) {
      dd = "0" + dd;
    }
    let mm = (today.getMonth() + 1).toString();
    if (mm.length === 1) {
      mm = "0" + mm;
    }
    let yyyy = today.getFullYear();

    let isAfter = moment("0".repeat(4 - birthdayYear.length) + birthdayYear + "-" + birthdayMonth + "-" + birthdayDay).isAfter("1900-01-01");
    let isBefore = moment("0".repeat(4 - birthdayYear.length) + birthdayYear + "-" + birthdayMonth + "-" + birthdayDay).isBefore(yyyy + "-" + mm + "-" + dd);
    if (isAfter && isBefore) {
      setBirthdayIsInRange(true);
      return true;
    } else {
      setBirthdayIsInRange(false);
      return false;
    }
  }

  const checkBirthdayIsInRange = (currentValue, valueType) => {
    let today = new Date();
    let dd = today.getDate().toString();

    if (dd.length === 1) {
      dd = "0" + dd;
    }
    let mm = (today.getMonth() + 1).toString();
    if (mm.length === 1) {
      mm = "0" + mm;
    }
    let yyyy = today.getFullYear();
    let birthDayString = "";

    if (valueType === "month") {
      birthDayString = "0".repeat(4 - birthdayYear.length) + birthdayYear + "-" + currentValue + "-" + birthdayDay;
    } else if (valueType === "day") {
      birthDayString = "0".repeat(4 - birthdayYear.length) + birthdayYear + "-" + birthdayMonth + "-" + currentValue;
    } else {
      birthDayString = "0".repeat(4 - currentValue.length) + currentValue + "-" + birthdayMonth + "-" + birthdayDay;
    }
    let isAfter = moment(birthDayString).isAfter("1900-01-01", "year");
    let isBefore = moment(birthDayString).isBefore(yyyy + "-" + mm + "-" + dd);
    if (isAfter && isBefore) {
      return true;
    } else {
      return false;
    }
  }

  //and sets it as well
  const checkBirthdayValidityCasually = () => {
    if (birthdayMonth === "" && birthdayDay === "" && birthdayYear === "") {
      setBirthdayIsValid(true);
      return true;
    }
    let validity = moment(birthdayMonth + "-" + birthdayDay + "-" + birthdayYear, 'MM-DD-YYYY', true).isValid();
    setBirthdayIsValid(validity);
    if (!validity) {
      setBirthdayIsInRange(true);
    }
    return validity;
  }

  const checkBirthdayValidity = (currentValue, valueType) => {
    let birthdayString = "";
    if (valueType === "month") {
      if (currentValue === "" && birthdayDay === "" && birthdayYear === "") {
        return true;
      }
      birthdayString = currentValue + "-" + birthdayDay + "-" + birthdayYear;

    } else if (valueType === "day") {
      if (birthdayMonth === "" && currentValue === "" && birthdayYear === "") {
        return true;
      }
      birthdayString = birthdayMonth + "-" + currentValue + "-" + birthdayYear;

    } else {
      if (birthdayMonth === "" && birthdayDay === "" && currentValue === "") {
        return true;
      }
      birthdayString = birthdayMonth + "-" + birthdayDay + "-" + currentValue;
    }

    return moment(birthdayString, 'MM-DD-YYYY', true).isValid();
  }

  function handleUserNameChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (value === "") {
      setUserNameIsUnique(true);
    } else {
      setUserNameUniqueness(value);
    }
    if (missingInputs && value !== "") {
      checkMissingInputs(e.target.name);
    }
  }

  function handlePhoneNumberChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (value === "") {
      setPhoneNumberIsUnique(true);
    } else {
      setPhoneNumberUniqueness(value);
    }
    if (missingInputs && value !== "") {
      checkMissingInputs(e.target.name);
    }
  }

  function handleEmailChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (checkEmailValidity(value)) {
      setEmailIsValid(true);
      setEmailUniqueness(value);
    } else {
      setEmailIsUnique(true);
    }
    if (value === "") {
      setEmailIsUnique(true);
    }
    if (missingInputs && value !== "") {
      checkMissingInputs(e.target.name);
    }
  }

  function handlePasswordChange(e) {
    const value = e.currentTarget.value;
    setInputStates({
      ...inputStates,
      [e.target.name]: value,
    });
    if (e.target.name === "password") {
      if (passwordIsTooSmall && value.length >= 5) {
        setPasswordIsTooSmall(false);
      }
      if (mistypedPassword && value === inputStates.password2) {
        setMistypedPassword(false);
      }
    } else if (mistypedPassword && value === inputStates.password) {
      setMistypedPassword(false);
    }
    if (missingInputs && value !== "") {
      checkMissingInputs(e.target.name);
    }
  }

  const setPhoneNumberUniqueness = (phoneNumber) => {
    if (phoneNumber !== "") {
      Axios.post(
        checkPhoneNumberRoute,
        {
          phone: phoneNumber,
        },
        { withCredentials: true }
      )
        .then(function (response) {
          setPhoneNumberIsUnique(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  const setUserNameUniqueness = (userName) => {
    if (userName !== "") {
      Axios.post(
        checkUserNameRoute,
        {
          username: userName,
        },
        { withCredentials: true }
      )
        .then(function (response) {
          setUserNameIsUnique(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  const setEmailUniqueness = (email) => {
    if (emailIsValid && email !== "") {
      Axios.post(
        checkEmailRoute,
        {
          email: email,
        },
        { withCredentials: true }
      )
        .then(function (response) {
          setEmailIsUnique(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  return (
    <div className="forms">
      {unnkownError ? <h3 style={{ textAlign: "center" }}>We're deeply sorry, unexpected error occured!</h3> : null}
      <div className="form-fields">
        <label className="labels" htmlFor="usern">
          Username: {userNameIsUnique ? null : <p style={{ color: "red", margin: "0", marginLeft: "1rem" }}>Already in use!</p>}
        </label>
        <input
          className="inputs"
          type="text"
          id="usern"
          placeholder="tsmith"
          value={inputStates.userName}
          name="userName"
          onChange={handleUserNameChange}
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
          onChange={handleInputChangeCasual}
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
          onChange={handleInputChangeCasual}
          onKeyDown={handleEnterKeydown}
        ></input>

        <label className="labels" htmlFor="email">
          E-mail: {emailIsValid ? null : <p style={{ color: "red", margin: "0", marginLeft: "1rem" }}>Invalid</p>}
          {emailIsUnique ? null : <p style={{ color: "red", margin: "0", marginLeft: "1rem" }}>Already in use!</p>}
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
          Birthday: <p style={{ color: "gray", margin: "0", marginLeft: "1rem" }}>Optional</p>
          {birthdayIsValid ? null : <p style={{ color: "red", margin: "0", marginLeft: "1rem" }}>Invalid</p>} {birthdayIsInRange ? null : <p style={{ color: "red", margin: "0", marginLeft: "1rem" }}>Out of Range 1900 - {new Date().getFullYear()}</p>}
        </label>
        <div style={{ margin: "auto", textAlign: "center", width: "16rem", }}>
          <input onKeyDown={handleEnterKeydown} onChange={handleBirthdayChange} className="calendar-inputs-2" type="text" size="2" maxLength="2" minLength="2" placeholder="MM" name="month"></input>
          <input onKeyDown={handleEnterKeydown} onChange={handleBirthdayChange} className="calendar-inputs-2" type="text" size="2" maxLength="2" minLength="2" placeholder="DD" name="day"></input>
          <input onKeyDown={handleEnterKeydown} onChange={handleBirthdayChange} className="calendar-inputs-4" type="text" size="4" maxLength="4" minLength="4" placeholder="YYYY" name="year"></input>
        </div>
        <label className="labels" htmlFor="phone">
          Phone Number: {phoneNumberIsUnique ? null : <p style={{ color: "red", margin: "0", marginLeft: "1rem" }}>Already in use!</p>}
        </label>
        <input
          className="inputs"
          type="text"
          id="phone"
          placeholder="02011111111"
          value={inputStates.phone}
          name="phone"
          onChange={handlePhoneNumberChange}
          onKeyDown={handleEnterKeydown}
        ></input>

        <label className="labels" htmlFor="password">
          Password: (<p style={{ color: `${passwordIsTooSmall ? "red" : "black"}`, margin: 0 }}>at least 5 characters!</p>)
        </label>
        <div style={{ display: "inline-flex", width: "64rem" }}>
          <input
            style={{ backgroundColor: `${mistypedPassword ? "red" : "white"}` }}
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
            onMouseDown={() => { changeToOpenSrc(1) }}
            onMouseUp={() => { changeToClosedSrc(1) }}
            onMouseOut={() => { changeToClosedSrc(1) }}
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
        <div style={{ display: "inline-flex", width: "64rem" }}>
          <input
            style={{ backgroundColor: `${mistypedPassword ? "red" : "white"}` }}
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
            onMouseDown={() => { changeToOpenSrc(2) }}
            onMouseUp={() => { changeToClosedSrc(2) }}
            onMouseOut={() => { changeToClosedSrc(2) }}
          >
            <img
              src={eyeSrc2}
              alt="see password"
              style={{ width: "2.5vw", height: "2vw" }}
            />
          </button>
        </div>
        {mistypedPassword ? <p style={{ textAlign: "center" }}>The given passwords doesn't match!</p> : null}
        {missingInputs ? <p className="speech-bubble">You need to fill out all input fields to Register!</p> : null}
        <button className="buttons" onClick={sendUserRegistrationData}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Registration;

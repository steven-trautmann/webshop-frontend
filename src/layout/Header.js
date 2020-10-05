import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { LoggedInContext } from "../context/LoggedInContext";

function Header(props) {
  const [logInStates, setLogInStates] = useState({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);
  const [eyeSrc, setEyeSrc] = useState("/images/eyes-closed.svg");
  const [inputType, setInputType] = useState("password");
  const [failedLogIn, setFailedLogIn] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const changeToClosedSrc = () => {
    setEyeSrc("/images/eyes-closed.svg");
    setInputType("password");
  };

  const changeToOpenSrc = () => {
    setEyeSrc("/images/eyes-open.svg");
    setInputType("text");
  };

  const handleChange = (event) => {
    setLogInStates({ ...logInStates, [event.target.name]: event.target.value });
  };

  const handleEnterKeydown = (event) => {
    if (event.keyCode === 13){
      logIn();
    }
  }

  const logIn = () => {
    if (logInStates.username !== "" && logInStates.password !== "") {
      Axios.post(
        "http://localhost:8080/user/login",
        { username: logInStates.username, password: logInStates.password },
        { withCredentials: true }
      )
        .then((response) => {
          localStorage.setItem("username", response.data.username);
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("roles", response.data.roles);
          setIsLoggedIn(true);
          window.location.href = "/";
        })
        .catch((error) => {
          if (!error.status) {
            setNetworkError(true);
          } else {
            setFailedLogIn(true);
          }
        });
    }
  };

  const addProduct = () => {
    Axios.get("http://localhost:8080/product/add", { withCredentials: true })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const logOut = () => {
    Axios.get("http://localhost:8080/user/logout", { withCredentials: true })
      .then((response) => {
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("roles");
        setIsLoggedIn(false);
        window.location.href = "/";
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Link to="/">
        <button>Home</button>
      </Link>

      {isLoggedIn ? (
        <div>
          <p>Hello there, {localStorage.getItem("username")}</p>
          <button onClick={addProduct}>add product (authenticated)</button>
          <button onClick={logOut}>log out</button>
        </div>
      ) : (
        <div>
          <Link to="/registration">
            <button>Register</button>
          </Link>

          <div>
            <h4>Log In:</h4>
            <table>
              <tbody>
                <tr>
                  <td>Username: </td>
                  <td>
                    <input
                      type="text"
                      onChange={handleChange}
                      onKeyDown={handleEnterKeydown}
                      name="username"
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>Password: </td>
                  <td>
                    <input
                      type={inputType}
                      onChange={handleChange}
                      onKeyDown={handleEnterKeydown}
                      name="password"
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
                      }}
                      onMouseDown={changeToOpenSrc}
                      onMouseUp={changeToClosedSrc}
                      onMouseOut={changeToClosedSrc}
                    >
                      <img
                        src={eyeSrc}
                        alt="see password"
                        style={{ width: "2.5vw", height: "2vw" }}
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            {failedLogIn ? (
              <p style={{ color: "red", fontSize: "1rem" }}>
                Wrong Username and/or Password
              </p>
            ) : null}
            {networkError ? (
              <p style={{ color: "red", fontSize: "1rem" }}>
                Unexpected network error occured.
              </p>
            ) : null}
            <button onClick={logIn}>Log In</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { LoggedInContext } from "../context/LoggedInContext";
import { InnerWidthContext } from "../context/InnerWidthContext";
import styled from "styled-components";
import "../style/navbar.css";

const NavDiv = styled.div`
    display: flex;
    position: absolute;
    right: 0;
    height: 100%;
  `;

function Header(props) {
  const [logInStates, setLogInStates] = useState({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);
  const [width, setWidth] = useContext(InnerWidthContext);
  const [eyeSrc, setEyeSrc] = useState("/images/eyes-closed.svg");
  const [inputType, setInputType] = useState("password");
  const [failedLogIn, setFailedLogIn] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, [setWidth]);

  const toggleSrc = () => {
    if (eyeSrc.slice(eyeSrc.indexOf("-") + 1) === "open.svg") {
      setInputType("password");
      setEyeSrc("/images/eyes-closed.svg");
    } else {
      setEyeSrc("/images/eyes-open.svg");
      setInputType("text");
    }
  }

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
    if (event.keyCode === 13) {
      logIn();
    }
  };

  function checkLoginFieldsAreFilled() {
    return logInStates.username !== "" && logInStates.password !== "";
  }

  const logIn = () => {
    if (checkLoginFieldsAreFilled()) {
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
          if (!error.response) {
            setFailedLogIn(false);
            setNetworkError(true);
          } else {
            setNetworkError(false);
            setFailedLogIn(true);
          }
        });
    }
  };

  // const addProduct = () => {
  //   Axios.get("http://localhost:8080/product/add", { withCredentials: true })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => console.log(error));
  // };

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
    <div className="nav-bar">
      <Link to="/">
        <button>Home</button>
      </Link>
      {isLoggedIn ? (
        <>
          <Link to="user">
            <button>User Page</button>
          </Link>
          <NavDiv>
            <p style={{ margin: "2rem 1rem 0 2rem" }}> Hello there, {localStorage.getItem("username")}</p>
            <button onClick={logOut}> log out </button>
          </NavDiv>
        </>
      ) : (
          <NavDiv>

            {width > 800 ?
              (
                <div style={{ display: "inline-flex" }}>
                  <table>
                    <tbody>
                      <tr>
                        <td> Username: </td>
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
                        <td> Password: </td>
                        <td>
                          <input
                            type={inputType}
                            onChange={handleChange}
                            onKeyDown={handleEnterKeydown}
                            name="password"
                          ></input>
                          <button
                            style={{
                              width: "2rem",
                              height: "2rem",
                              padding: "0",
                              border: "0",
                              borderRadius: "40%",
                              outline: "none",
                              cursor: "pointer",
                              display: "relative",
                              top: "0.4rem",
                              WebkitTapHighlightColor: "transparent"
                            }}
                            onTouchStart={toggleSrc}
                            onTouchEnd={(e) => { e.preventDefault() }}
                            onMouseDown={changeToOpenSrc}
                            onMouseUp={changeToClosedSrc}
                            onMouseOut={changeToClosedSrc}
                          >
                            <img
                              src={eyeSrc}
                              alt="see password"
                              style={{ width: "1.5rem", height: "1rem" }}
                            />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {failedLogIn ? (
                    <p style={{ color: "red", fontSize: "1rem" }}>
                      Wrong Username and / or Password.
                    </p>
                  ) : null}
                  {networkError ? (
                    <p style={{ color: "red", fontSize: "1rem" }}>
                      Unexpected network error occured.
                    </p>
                  ) : null}
                  <button className="login-button" onClick={logIn}> Log In </button>
                  {!checkLoginFieldsAreFilled() ? <p className="hiddenErrorMessage">Fill both Username and Password fields.</p> : null}
                </div>
              ) : <Link to="login"><button> Log In </button></Link>}



            <p style={{ fontSize: "1.2rem", margin: "2rem" }}> Or </p>
            <Link to="/registration">
              <button> Register </button>
            </Link>
          </NavDiv>
        )}
    </div>
  );
}

export default Header;

import React, { useState, useContext } from 'react';
import "../style/forms.css";
import Axios from "axios";
import { LoggedInContext } from "../context/LoggedInContext";

const Login = () => {
    if (localStorage.getItem("username") != null) {
        window.location.href = "/";
    }

    const [, setIsLoggedIn] = useContext(LoggedInContext);
    const [eyeSrc, setEyeSrc] = useState("/images/eyes-closed.svg");
    const [inputType, setInputType] = useState("password");
    const [failedLogIn, setFailedLogIn] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    const [logInStates, setLogInStates] = useState({
        username: "",
        password: "",
    });

    const handleEnterKeydown = (event) => {
        if (event.keyCode === 13) {
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
                    console.log(error.response);
                    console.log(error.response);
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

    const handleChange = (event) => {
        setLogInStates({ ...logInStates, [event.target.name]: event.target.value });
    };

    const changeToClosedSrc = () => {
        console.log("fasz")
        setEyeSrc("/images/eyes-closed.svg");
        setInputType("password");
    };

    const changeToOpenSrc = () => {
        setEyeSrc("/images/eyes-open.svg");
        setInputType("text");
    };

    return (
        <div className="forms" style={{ height: "20rem" }}>
            <div className="form-fields">
                <label className="labels" htmlFor="usern">
                    Username:
                </label>
                <input
                    className="inputs"
                    type="text"
                    id="usern"
                    placeholder="tsmith"
                    value={logInStates.username}
                    name="username"
                    onChange={handleChange}
                    onKeyDown={handleEnterKeydown}
                ></input>

                <label className="labels" htmlFor="password">
                    Password:
                </label>

                <div style={{ display: "inline-flex", width: "100%" }}>
                    <input
                        className="inputs"
                        type={inputType}
                        id="password"
                        placeholder="password"
                        value={logInStates.password}
                        name="password"
                        onChange={handleChange}
                        onKeyDown={handleEnterKeydown}
                    ></input>
                    <button
                        style={{
                            width: "2rem",
                            padding: "0",
                            border: "0",
                            borderRadius: "40%",
                            outline: "none",
                            cursor: "pointer",
                            marginLeft: "1rem",
                            backgroundColor: "darkgray"
                        }}
                        onMouseDown={() => { changeToOpenSrc() }}
                        onMouseUp={() => { changeToClosedSrc() }}
                        onMouseOut={() => { changeToClosedSrc() }}
                    >
                        <img
                            src={eyeSrc}
                            alt="see password"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </button>
                </div>

                {failedLogIn ? (
                    <p style={{ color: "red", fontSize: "1rem", textAlign: "center" }}>
                        Wrong Username and / or Password.
                    </p>
                ) : null}
                {networkError ? (
                    <p style={{ color: "red", fontSize: "1rem" }}>
                        Unexpected network error occured.
                    </p>
                ) : null}
                <button className="buttons" onClick={logIn}> Log In </button>
            </div>

        </div>
    );
}

export default Login;

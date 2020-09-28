import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

const readTheCookie = () => {
  console.log("reading the cookie");
  Axios.get("http://localhost:8080/read-cookie", { withCredentials: true })
    .then(console.log("read the cookie"))
    .catch((error) => console.log(error));
};

function Header(props) {
  return (
    <div>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/registration">
        <button>Register</button>
      </Link>

      <button onClick={readTheCookie}>read cookie (backend)</button>
    </div>
  );
}

export default Header;

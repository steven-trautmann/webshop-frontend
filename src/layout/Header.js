import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <div>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/registration">
        <button>Register</button>
      </Link>
    </div>
  );
}

export default Header;

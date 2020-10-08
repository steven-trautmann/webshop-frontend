import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./layout/Header";
import Registration from "./component/Registration";
import Login from "./component/Login";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/login" component={Login} />
      </Router>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./layout/Header";
import Registration from "./component/Registration";
import Login from "./component/Login";
import Home from "./component/Home";
import UserPage from "./component/UserPage";
import { LoggedInContextProvider } from "./context/LoggedInContext";
import { InnerWidthProvider } from "./context/InnerWidthContext"

function App() {
  return (
    <div>
      <Router>
        <InnerWidthProvider>
          <LoggedInContextProvider>
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/registration" component={Registration} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/user" component={UserPage} />
          </LoggedInContextProvider>
        </InnerWidthProvider>
      </Router>
    </div>
  );
}

export default App;

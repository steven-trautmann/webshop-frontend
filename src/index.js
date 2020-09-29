import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { LoggedInContextProvider } from "./context/LoggedInContext";

ReactDOM.render(
  <React.StrictMode>
    <LoggedInContextProvider>
      <App />
    </LoggedInContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

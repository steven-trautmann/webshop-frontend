import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { LoggedInContextProvider } from "./context/LoggedInContext";
import { InnerWidthProvider } from "./context/InnerWidthContext";

ReactDOM.render(
  <React.StrictMode>
    <InnerWidthProvider>
      <LoggedInContextProvider>
        <App />
      </LoggedInContextProvider>
    </InnerWidthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

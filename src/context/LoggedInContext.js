import React, { useState, createContext, useEffect } from "react";

export const LoggedInContext = createContext();

export const LoggedInContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("username") != null);
  }, []);

  return (
    <LoggedInContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      {props.children}
    </LoggedInContext.Provider>
  );
};

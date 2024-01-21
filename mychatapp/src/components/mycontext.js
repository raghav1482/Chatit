
import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const [light, setLight] = useState(true);

  const refreshData = () => {
    setRefresh(!refresh);
  };
  const nightMode = () => {
    setLight(!light);
  };

  return (
    <MyContext.Provider value={{ refresh, refreshData ,light,nightMode}}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};

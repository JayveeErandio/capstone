import { createContext } from "react";

export const StateVariables = createContext();

export const Provider = ({ children }) => {
  return (
    <StateVariables.Provider value={{}}>{children}</StateVariables.Provider>
  );
};

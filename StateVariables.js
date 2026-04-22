import { createContext, useState } from "react";
export const StateVariables = createContext();

export const Provider = ({ children }) => {
  const login = async (ID, password) => {
    const data = { success: true, last_name: "tadili" }; // ==== BACKEND BACKEND BACKEND

    if (data.success) return true;
    else return false;
  };

  return (
    <StateVariables.Provider value={{ login }}>
      {children}
    </StateVariables.Provider>
  );
};

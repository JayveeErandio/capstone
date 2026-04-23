import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const login = async (ID, password) => {
    const data = (() => {
      if (ID == "202310097" && password == "aso")
        return { success: true, last_name: "erandio", first_name: "jayvee" };
      else return { success: false };
    })(); // ==== BACKEND BACKEND BACKEND

    if (data.success) return true;
    else return false;
  };

  const [page, setPage] = useState("login");

  return (
    <AuthContext.Provider value={{ login, page, setPage }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (ID, password) => {
    const data = { success: true, last_name: "tadili" }; // ==== BACKEND BACKEND BACKEND

    if (data.success) return true;
    else return false;
  };

  const page = () => {
    return "login";
  };

  return (
    <AuthContext.Provider value={{ login, page }}>
      {children}
    </AuthContext.Provider>
  );
};

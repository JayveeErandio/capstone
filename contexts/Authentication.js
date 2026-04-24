import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // ==== BACKEND BACKEND BACKEND
  const login = async (ID, password) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(2000);

    const data = (() => {
      if (ID == "202310097" && password == "aso")
        return { success: true, last_name: "erandio", first_name: "jayvee" };
      else return { success: false };
    })();

    if (data.success) {
      setUser(data);
      return true;
    } else return false;
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analyze = async (entry) => {};

  const [page, setPage] = useState("login");

  const [entries, setEntries] = useState({
    door1: null,
    door2: null,
    door3: null,
    door4: null,
  });

  const restartEntries = () => {
    setEntries(
      Object.fromEntries(Object.keys(entries).map((key) => [key, ""])),
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        page,
        setPage,
        entries,
        setEntries,
        restartEntries,
        isAnalyzing,
        setIsAnalyzing,
        analyze,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [dailyStatus, setDailyStatus] = useState();

  const login = async (ID, password) => {
    // ==== BACKEND ====
    // Required: Supabase
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

  const analyze = async (entry) => {
    // ==== BACKEND ====
    // Required: GoogleAI & Supabase

    await sleep(3000);
    const comment =
      "You've been riding this this buzz for a few days. That's great!";
    const suggestions = [
      {
        title: "Celebrate with Others",
        details: "Share your good energy",
        icon: "🎉",
      },
      { title: "Reach Out", details: "Connect with a friend", icon: "💬" },
      {
        title: "Community Events",
        details: "GCU social activities ",
        icon: "🤝",
      },
    ];
    const followup = "🤔 Who gave you good energy today?";

    setDailyStatus({
      comment: comment,
      suggestions: suggestions,
      followup: followup,
    });
  };

  const [page, setPage] = useState("login");

  const [entries, setEntries] = useState({
    door1: null,
    door2: null,
    door3: null,
    door4: null,
  });

  const restartEntries = () => {
    setEntries(
      Object.fromEntries(Object.keys(entries).map((key) => [key, null])),
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
        dailyStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

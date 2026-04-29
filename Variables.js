import { createContext, useState } from "react";
import { loginUser, signupUser } from "./services/auth";
export const Variables = createContext();

export const Provider = ({ children }) => {
  const [user, setUser] = useState({ success: true });

  const [dailyStatus, setDailyStatus] = useState();

  const login = async (studentID, password) => {
    const result = await loginUser(studentID, password);

    if (result.success) {
      setUser(result);
      return true;
    }

    return false;
  };

  const signup = async (ID) => {
    signupUser(ID);
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = async () => {
    // ==== BACKEND ====
    // Required: GoogleAI & Supabase

    await sleep(3000);
    const comment =
      "You've been riding this buzz for a few days. That's great!";
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
      journal: "",
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

  const updateJournal = () => {
    // ==== BACKEND ====
    // Required: Supabase
    const data = dailyStatus.journal;

    async function updateData() {
      //HERE
    }
    updateData();
  };

  return (
    <Variables.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        page,
        setPage,
        entries,
        setEntries,
        restartEntries,
        isAnalyzing,
        setIsAnalyzing,
        analyze,
        dailyStatus,
        setDailyStatus,
        updateJournal,
      }}
    >
      {children}
    </Variables.Provider>
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

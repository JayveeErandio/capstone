import { createContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  signupUser,
  getStoredUser,
} from "./services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const Variables = createContext();

const randomColor = () => {
  const colors = ["red", "yellow", "green", "cyan", "indigo", "pink"];

  return colors[Math.floor(Math.random() * 6)];
};

export const Provider = ({ children }) => {
  const [user, setUser] = useState();
  const [firstDay, setFirstDay] = useState(new Date().getDay());
  const [statusDays, setStatusDays] = useState([]);
  const [best, setBest] = useState(0);

  // Storage Data Retrieval
  useEffect(() => {
    async function temp() {
      let value;
      const storedUser = await getStoredUser();
      setUser(storedUser);

      value = await AsyncStorage.getItem("dayBasis");
      if (value) setFirstDay(value);

      value = await AsyncStorage.getItem("statusDays");
      if (value) setStatusDays(value);
    }

    temp();
  }, []);

  const [profcol, setProfcol] = useState(randomColor());

  const [dailyStatus, setDailyStatus] = useState();

  const login = async (studentID, password) => {
    const result = await loginUser(studentID, password);

    if (result.success) {
      setUser(result);
      return true;
    }

    return false;
  };

  const logout = async () => {
    await logoutUser();
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
        logout,
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
        profcol,
        setProfcol,
        firstDay,
        statusDays,
        best,
      }}
    >
      {children}
    </Variables.Provider>
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

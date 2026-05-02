import { createContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  signupUser,
  getStoredUser,
} from "./services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const Variables = createContext();
import { askMood } from "./services/chatbot";
import { supabase } from "./lib/supabase";
import * as storage from "./services/storage";

export const Provider = ({ children }) => {
  // Mga variables na globally na gagamitin throughout ng app
  const [user, setUser] = useState();
  const [firstDay, setFirstDay] = useState(new Date().getDay());
  const [statusDays, setStatusDays] = useState([]);
  const [dailyStatus, setDailyStatus] = useState();
  const [best, setBest] = useState(0);
  const [profcol, setProfcol] = useState(randomColor());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [page, setPage] = useState("login");
  const [streak, setStreak] = useState(0);
  const [entries, setEntries] = useState({
    door1: null,
    door2: null,
    door3: null,
    door4: null,
  });

  // Mga variables na nakasave na or galing sa storage ng cellphone na ilalagay dun sa global variables
  useEffect(() => {
    async function temp() {
      //await storage.deleteAll();
      if (!(await storage.getUser())) return;

      const data = await storage.getAll();
      setUser(data.user);
      setStatusDays(data.statusDays);
    }
    temp();
  }, []);

  const login = async (studentID, password) => {
    const result = await loginUser(studentID, password);

    if (result.success) {
      setUser(result);
      storage.putUser(result);
      const { data, error } = await supabase
        .from("status_days")
        .select("date, id, journal, mood")
        .eq("account_id", result.id);
      setStatusDays(data);
      storage.putStatusDays(data);

      return true;
    }

    return false;
  };

  const logout = async () => {
    await logoutUser();
    await storage.deleteAll();
  };

  const signup = async (ID) => {
    signupUser(ID);
  };

  const analyze = async () => {
    // ==== BACKEND ====
    // Required: Supabase

    //const answer = await askMood(entries);
    //const result = JSON.parse(answer.slice(8).slice(0, -4));
    const result = {
      comment: "ASO",
      suggestions: [{ title: "titulo", details: "detalye", icon: "X" }],
      followup: "bakit po?",
    };
    setDailyStatus(result);
    await storage.putDailyStatus(result);

    const newdata = {
      mood:
        entries.door1 == "High"
          ? entries.door3 == "Light"
            ? "excited"
            : "stressed"
          : entries.door3 == "Light"
            ? "content"
            : "drained",
      date: new Date(Date.now()).toISOString().split("T")[0],
      account_id: user.id,
    };
    const { data, error } = await supabase
      .from("status_days")
      .insert([newdata])
      .select();
    delete data[0].account_id;
    setStatusDays([...statusDays, data[0]]);
    storage.putStatusDays(statusDays);

    if (!(await storage.getFirstDay())) {
      console.log(2323);
      await storage.putFirstDay(firstDay);
      console.log(5656);
    }
  };

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
        streak,
      }}
    >
      {children}
    </Variables.Provider>
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomColor = () => {
  const colors = ["red", "yellow", "green", "cyan", "indigo", "pink"];

  return colors[Math.floor(Math.random() * 6)];
};

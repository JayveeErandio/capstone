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
      //console.log(await storage.getFirstDay());
      //await storage.deleteAll();

      if (!(await storage.getUser())) return;

      const data = await storage.getAll();
      setUser(data.user);
      setStatusDays(data.statusDays);
      setDailyStatus(data.dailyStatus);
    }
    temp();
  }, []);

  const setupData = async () => {
    if (statusDays.length > 0) {
      // For First Day Basis
      const oldest = statusDays.reduce((min, curr) => {
        return new Date(curr.date) < new Date(min.date) ? curr : min;
      });
      setFirstDay(new Date(oldest.date).getDay());
      await storage.putFirstDay(new Date(oldest.date).getDay());

      // For Streak
      let curdate = new Date().toISOString().split("T")[0];
      if (statusDays.find((current) => current.date == curdate)) {
        let minusDay = 0;
        do {
          setStreak(streak + 1);
          minusDay++;
          curdate = new Date(Date.now() - 86400000 * minusDay)
            .toISOString()
            .split("T")[0];
        } while (statusDays.find((current) => current.date == curdate));
      }
    }
  };

  const login = async (studentID, password) => {
    const result = await loginUser(studentID, password);

    if (result.success) {
      setUser(result);
      const fetchDailyStatus = JSON.parse(result.daily_result);
      setDailyStatus(fetchDailyStatus);
      await storage.putDailyStatus(fetchDailyStatus);
      storage.putUser(result);
      const { data, error } = await supabase
        .from("status_days")
        .select("date, id, journal, mood")
        .eq("account_id", result.id);

      setStatusDays(data);
      await storage.putStatusDays(data);
      await setupData();

      return true;
    }

    return false;
  };

  const logout = async () => {
    await logoutUser();
    await storage.deleteAll();
    setStreak(0);
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
    await supabase
      .from("students")
      .update({ daily_result: result })
      .eq("id", user.id);

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
    await storage.putStatusDays(statusDays);

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

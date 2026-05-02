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
  const [user, setUser] = useState();
  const [firstDay, setFirstDay] = useState(new Date().getDay());
  const [statusDays, setStatusDays] = useState([]);
  const [dailyStatus, setDailyStatus] = useState();
  const [best, setBest] = useState(0);
  const [entries, setEntries] = useState({
    door1: null,
    door2: null,
    door3: null,
    door4: null,
  });

  // Storage Data Retrieval
  useEffect(() => {
    async function temp() {
      storage.getAll();
      let value;
      const storedUser = await getStoredUser();
      setUser(storedUser);

      if (!storedUser) return;

      value = await AsyncStorage.getItem("dayBasis");
      if (value) setFirstDay(value);

      value = await AsyncStorage.getItem("statusDays");
      if (value) setStatusDays(JSON.parse(value));

      value = await AsyncStorage.getItem("dailyStatus");
      if (value) setDailyStatus(JSON.parse(value));

      value = await AsyncStorage.getItem("firstDay");
      if (value) setFirstDay(JSON.parse(value));

      value = await AsyncStorage.getItem("best");
      if (value) setBest(JSON.parse(value));
    }

    temp();
  }, []);

  let start = 0;
  let golang = true;
  let streak = 0;
  while (golang) {
    const temp = new Date(Date.now() - 86400000 * start)
      .toISOString()
      .split("T")[0];

    if (statusDays.find((current) => current.date == temp)) streak++;
    else break;
    start++;
  }

  useEffect(() => {
    const temp = async () => {
      await AsyncStorage.setItem("statusDays", JSON.stringify(statusDays));

      if (streak > best) {
        setBest(streak);
        await AsyncStorage.setItem("best", JSON.stringify(streak));
      }
    };
    temp();
  }, [statusDays]);

  const [profcol, setProfcol] = useState(randomColor());

  const login = async (studentID, password) => {
    const result = await loginUser(studentID, password);

    if (result.success) {
      setUser(result);
      const { data, error } = await supabase
        .from("status_days")
        .select("date, id, journal, mood")
        .eq("account_id", result.id);

      setStatusDays(data);
      return true;
    }

    return false;
  };

  const logout = async () => {
    await logoutUser();
    await AsyncStorage.clear();
  };

  const signup = async (ID) => {
    signupUser(ID);
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = async () => {
    // ==== BACKEND ====
    // Required: Supabase

    //const answer = await askMood(entries);
    const result = {
      comment: "ASO",
      suggestions: [{ title: "titulo", details: "detalye", icon: "X" }],
      followup: "bakit po?",
    }; //JSON.parse(answer.slice(8).slice(0, -4));
    setDailyStatus(result);

    await AsyncStorage.setItem("dailyStatus", JSON.stringify(result));

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

    await AsyncStorage.setItem("statusDays", JSON.stringify(statusDays));

    const firstDayTemp = await AsyncStorage.getItem("firstDay");
    console.log(firstDayTemp);
    if (!firstDayTemp)
      await AsyncStorage.setItem(
        "firstDay",
        JSON.stringify(new Date().getDay()),
      );
  };

  const [page, setPage] = useState("login");

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

import { createContext, useState } from "react";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_KEY,
);

export const Variables = createContext();

export const Provider = ({ children }) => {
  const [user, setUser] = useState({
    success: true,
    last_name: "erandio",
    first_name: "jayvee",
  });
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

  const signup = async (ID) => {
    const { data, error } = await supabase.from("notifications").insert([
      {
        account_id: 2,
        text_content: `Student with a student-number ${ID} has requested account creation.`,
        type: "register",
        is_seen: false,
      },
    ]);
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

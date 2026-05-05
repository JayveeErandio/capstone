import { createContext, useState, useEffect } from "react";
import { signupUser } from "./services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const Variables = createContext();
import { askMood } from "./services/chatbot";
import * as storage from "./services/storage";
import * as supabase from "./services/supabase";

export const Provider = ({ children }) => {
  // Mga variables na globally na gagamitin throughout ng app
  const [user, setUser] = useState({});
  const [firstDay, setFirstDay] = useState(new Date().getDay());
  const [statusDays, setStatusDays] = useState([]);
  const [dailyStatus, setDailyStatus] = useState();
  const [best, setBest] = useState(0);
  const [profcol, setProfcol] = useState(randomColor());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [page, setPage] = useState("login");
  const [streak, setStreak] = useState(0);
  const [posts, setPosts] = useState([]);
  const [myposts, setMyposts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [entries, setEntries] = useState({
    door1: null,
    door2: null,
    door3: null,
    door4: null,
  });

  // Isesetup nya lang mga variables galing phone storage, kung meron lang or may nakalogin na user
  useEffect(() => {
    async function temp() {
      //console.log(await storage.getFirstDay());\
      //await storage.deleteAll();

      if (await storage.getUser()) setupData();
    }
    temp();
  }, []);

  const setupData = async () => {
    const data = await storage.getAll();
    await setStatusDays(data.statusDays);
    await setDailyStatus(data.dailyStatus);
    await setPendingPosts(data.pendingPosts);
    await setPosts(data.posts);
    await setMyposts(data.myPosts);

    // Variables that need computations
    if (data.statusDays.length > 0) {
      // To know whether the daily status pertains for today's check-in

      // For First Day Basis
      const oldest = statusDays.reduce((min, curr) => {
        return new Date(curr.date) < new Date(min.date) ? curr : min;
      });
      setFirstDay(new Date(oldest.date).getDay());
      await storage.putFirstDay(new Date(oldest.date).getDay());

      // For Streak
      let count = 0;
      let curdate = new Date().toISOString().split("T")[0];
      if (statusDays.find((current) => current.date == curdate)) {
        let minusDay = 0;
        do {
          count++;
          minusDay++;
          curdate = new Date(Date.now() - 86400000 * minusDay)
            .toISOString()
            .split("T")[0];
        } while (statusDays.find((current) => current.date == curdate));
        setStreak(count);
      }
    }

    setUser(data.user);
  };

  const login = async (studentID, password) => {
    const result = await supabase.login(studentID, password);

    if (result.success) {
      let temp;
      await storage.putUser(result);
      await storage.putStatusDays(await supabase.getStatusDays(result.id));
      await storage.putPendingPost(await supabase.getPendingPosts(result.id));
      await storage.putPosts(await supabase.getPosts(result.id));
      await storage.putMyPosts(await supabase.getMyPosts(result.id));

      setupData();

      setUser(result);
      return true;
    }

    return false;
  };

  const deleteAll = function () {
    setUser({});
    setPendingPosts([]);
    setStatusDays([]);
    setStreak(0);
  };

  const logout = async () => {
    await supabase.logout();
    await storage.deleteAll();
    deleteAll();
  };

  const signup = async (ID) => {
    signupUser(ID);
  };

  const analyze = async () => {
    const answer = await askMood(entries);
    const result = JSON.parse(answer.slice(8).slice(0, -4));
    //const result = {
    //  comment: "ASO",
    //   suggestions: [{ title: "titulo", details: "detalye", icon: "X" }],
    //  followup: "bakit po?",
    //};
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

  const updateReact = async (post_id, mood) => {
    const current = posts.map((post) =>
      post.id === post_id
        ? {
            ...post,
            myreact: post.myreact == mood ? null : mood,
          }
        : post,
    );
    setPosts(current);
    storage.putPosts(current);

    await supabase.updateReact(post_id, user.id, mood);
  };

  const putPost = async (mood, text) => {
    setPendingPosts([...pendingPosts, { mood: mood, content: text }]);
    await supabase.putPost({ student_id: user.id, mood: mood, content: text });
    await storage.putPendingPost([
      ...pendingPosts,
      { mood: mood, content: text },
    ]);
  };

  const deletePost = async (data, isPosted) => {
    if (isPosted) {
      await supabase.deletePost(data.id);
      let newData = posts.filter((current) => current.id != data.id);
      setPosts(newData);
      newData = myposts.filter((current) => current.id != data.id);
      setMyposts(newData);
    } else {
      await supabase.deletePendingPost(data.id);
      const newData = pendingPosts.filter((current) => current.id != data.id);
      setPendingPosts(newData);
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
        posts,
        setPosts,
        myposts,
        pendingPosts,
        setPendingPosts,
        deletePost,
        updateReact,
        putPost,
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

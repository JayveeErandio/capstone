import { createContext, useState, useEffect } from "react";
import { signupUser } from "./services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const Variables = createContext();
import * as chatbot from "./services/chatbot";
import * as storage from "./services/storage";
import * as supabase from "./services/supabase";
import { sendPushNotification } from "./services/mobilenotif";

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
  const [notifications, setNotifications] = useState([]);

  // Isesetup nya lang mga variables galing phone storage, kung meron lang or may nakalogin na user
  useEffect(() => {
    async function temp() {
      if (await storage.getUser()) setupData();
    }
    temp();
  }, []);

  const setupData = async (result) => {
    const data = await storage.getAll();
    await setStatusDays(data.statusDays);
    await setDailyStatus(data.dailyStatus);
    await setPendingPosts(data.pendingPosts);
    await setPosts(data.posts);
    await setMyposts(data.myPosts);
    await setNotifications(data.notifications);

    const performNotif = async (newData) => {
      setNotifications((prev) => [newData, ...prev]);
      await storage.putNotifications([newData, ...notifications]);
    };
    await supabase.realtimeNotification(performNotif, result.id);

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
      await storage.putNotifications(
        await supabase.getNotifications(result.id),
      );

      setupData(result);

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
    await supabase.removeRealtimeNotification();
  };

  const signup = async (ID) => {
    signupUser(ID);
  };

  const analyze = async () => {
    const answer = await chatbot.askMood(entries);
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
    let current = posts.map((post) =>
      post.id === post_id
        ? {
            ...post,
            myreact: post.myreact == mood ? null : mood,
          }
        : post,
    );
    setPosts(current);
    storage.putPosts(current);

    current = myposts.map((post) =>
      post.id === post_id
        ? {
            ...post,
            myreact: post.myreact == mood ? null : mood,
          }
        : post,
    );
    setMyposts(current);
    storage.putMyPosts(current);

    await supabase.updateReact(post_id, user.id, mood);

    await supabase.updateReact(post_id, user.id, mood);
  };

  const putPost = async (mood, text) => {
    //const result = JSON.parse(
    //  (await chatbot.verifyPost(text)).slice(8).slice(0, -4),
    //); // AI-SHUTDOWN
    const result = { isAllowed: true, reason: "Nakakabastos may muraa" }; // AI-REPLACE
    console.log(result);
    if (result.isAllowed) {
      await supabase.putNotification({
        title: "Post Approved",
        content:
          'Your post "' +
          text.slice(0, 50) +
          '" does not show any violated rules. You can now check it out in space feed!',
        student_id: user.id,
        type: "post_approved",
      });
      const { data, error } = await supabase.putPost({
        mood: mood,
        content: text,
        student_id: user.id,
      });
      delete data[0].student_id;
      delete data[0].status;

      data[0].myreact = null;
      data[0].reactions = {};
      data[0].students = { anonymous_name: user.anonymous_name };

      await storage.putPosts([data[0], ...posts]);
      await storage.putMyPosts([data[0], ...myposts]);

      setPosts([data[0], ...posts]);
      setMyposts([data[0], ...myposts]);
    } else {
      await supabase.putNotification({
        title: "Suspicious Post",
        content:
          'Your post, "' +
          text.slice(0, 50) +
          '", has been marked as suspicious. For the meantime, your post will remain on pending status while GCU reviews it before approval.',
        student_id: user.id,
        type: "gcu_review",
      });

      const { data, error } = await supabase.putPendingPost({
        student_id: user.id,
        mood: mood,
        content: text,
        ai_say: result.reason,
      });
      delete data[0].student_id;
      delete data[0].ai_say;

      const temp = [data[0], ...pendingPosts];
      setPendingPosts(temp);
      await storage.putPendingPost(temp);
    }
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
      await storage.putPendingPost(newData);
    }
  };

  const readNotification = async (notif_id) => {
    const newNotifs = notifications.map((current) => {
      if (notif_id != null)
        if (current.id == notif_id) {
          return { ...current, is_seen: true };
        } else return current;
      else return { ...current, is_seen: true };
    });
    setNotifications(newNotifs);
    await supabase.readNotification(notif_id, user.id);
    await storage.putNotifications(newNotifs);
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
        notifications,
        readNotification,
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

import { createContext, useState, useEffect } from "react";
import * as chatbot from "./services/chatbot";
import * as storage from "./services/storage";
import * as supabase from "./services/supabase";

export const Provider = ({ children }) => {
  // Mga variables na globally na gagamitin throughout ng app
  const [user, setUser] = useState({});
  const [firstDay, setFirstDay] = useState(new Date().getDay());
  const [statusDays, setStatusDays] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [page, setPage] = useState("login");
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
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState({});
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [chats, setChats] = useState([]);
  const [canSend, setCanSend] = useState(true);
  // Yung mga variables na nasa baba na is mga temporary variable for journal at home page.
  // Malaki kasi data nila kung puro retrieve, baka magcause ng low performance
  // So iistore na natin sya statically
  const [dailyStatus, setDailyStatus] = useState();
  const [totalMood, setTotalMood] = useState(0);
  const [mostMood, setMostMood] = useState();
  const [curStreak, setCurStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [journWeek, setJournWeek] = useState([]);
  const [journMonth, setJournMonth] = useState([]);
  const [journYear, setJournYear] = useState([]);
  const [journEntry, setJournEntry] = useState([]);

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
    await setChats(data.chats);
    const recentStatus = data.statusDays.find(
      (current) => current.date == new Date().toISOString().split("T")[0],
    );
    if (recentStatus) {
      setDailyStatus({
        ...JSON.parse(data.user.daily_result),
        journal: recentStatus.journal,
      });

      setEntries({
        door1:
          recentStatus.mood == "excited" || recentStatus.mood == "stressed"
            ? "High"
            : "Low",
        door2: null,
        door3:
          recentStatus.mood == "excited" || recentStatus.mood == "content"
            ? "Light"
            : "Heavy",
        door4: null,
      });
    }
    let temp = await supabase.getSchedules();
    const grouped = Object.values(
      temp.reduce((acc, datetime) => {
        const dateObj = new Date(datetime);

        const date = dateObj.toLocaleDateString("en-CA");

        const time = dateObj.toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const day = dateObj
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase();

        if (!acc[date]) {
          acc[date] = {
            date,
            day,
            times: [],
          };
        }

        acc[date].times.push(time);

        return acc;
      }, {}),
    );
    setAvailableSchedules(grouped);
    temp = data.appointments;
    setBooks(
      temp.filter(
        (current) =>
          current.status != "Pending" && current.status != "Scheduled",
      ),
    );
    setCurrentBook(
      temp.find(
        (current) =>
          current.status == "Pending" || current.status == "Scheduled",
      ) ?? {},
    );
    computeStatus(data.statusDays);
    setUser(data.user);

    const realtimePerformer = async (newData) => {
      setNotifications((prev) => [newData, ...prev]);
      await storage.putNotifications([newData, ...notifications]);
    };

    supabase.realtime(realtimePerformer, data.user.id);
  };

  const login = async (studentID, password) => {
    const result = await supabase.login(studentID, password);

    if (result.success) {
      await storage.putUser(result);
      await storage.putStatusDays(await supabase.getStatusDays(result.id));
      await storage.putPendingPost(await supabase.getPendingPosts(result.id));
      await storage.putPosts(await supabase.getPosts(result.id));
      await storage.putMyPosts(await supabase.getMyPosts(result.id));
      await storage.putNotifications(
        await supabase.getNotifications(result.id),
      );
      await storage.putAppointments(await supabase.getAppointments(result.id));
      await storage.putChats(await supabase.getChats(result.id));
      await setupData(result);

      return true;
    }

    return false;
  };

  const logout = async () => {
    setCanSend(true);
    await supabase.logout();
    await storage.deleteAll();
    deleteAll();
    await supabase.removeRealtimeNotification();
  };

  const signup = async (ID) => {
    console.log("There has been no events for signup function");
  };

  const analyze = async () => {
    const answer = await chatbot.askMood(entries);
    const result = JSON.parse(answer.slice(8).slice(0, -4));

    setDailyStatus(result);

    await storage.putDailyStatus(result);

    await supabase.updateDailyResult(result, user.id);

    const newdata = {
      mood:
        entries.door1 == "High"
          ? entries.door3 == "Light"
            ? "excited"
            : "stressed"
          : entries.door3 == "Light"
            ? "content"
            : "drained",
      date: new Date().toISOString().split("T")[0],
      account_id: user.id,
    };
    const { data } = await supabase.putStatusDays(newdata);

    delete data[0].account_id;
    setStatusDays([...statusDays, data[0]]);
    await storage.putStatusDays(statusDays);
    computeStatus([...statusDays, data[0]]);
  };

  const deleteAll = function () {
    setUser({});
    setPendingPosts([]);
    setStatusDays([]);
    setStreak(0);
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
    const result = JSON.parse(
      (await chatbot.verifyPost(text)).slice(8).slice(0, -4),
    ); // AI-SHUTDOWN
    //const result = { isAllowed: true, reason: "Nakakabastos may muraa" }; // AI-REPLACE

    if (result.isAllowed) {
      await supabase.putNotification({
        title: "Post Approved",
        content:
          'Your post "' +
          text.slice(0, 50) +
          '..." does not show any violated rules. You can now check it out in space feed!',
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

  const reportPost = async (post) => {
    await supabase.updateFlagged(post.id);
    const poser = await supabase.getStudent(post.student_id);
    const title =
      capitalizeWords(user.last_name) +
      " reported " +
      capitalizeWords(poser.last_name) +
      "'s post.";
    const content =
      'A post "' +
      post.content.slice(0, 24) +
      '..." by ' +
      capitalizeWords(poser.last_name) +
      " (" +
      poser.student_number +
      ") was reported. Check it out why for more details.";
    await supabase.putNotification({
      title: title,
      content: content,
      type: "reported_post",
      student_id: 1,
    });
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

  const bookAppointment = async () => {
    function toUTCDateTime(date, time) {
      return new Date(`${date}T${time}:00`)
        .toISOString()
        .replace(".000Z", "+00:00");
    }
    const newForm = currentBook;
    newForm.status = "Pending";
    newForm.datetime = toUTCDateTime(newForm.date, newForm.time);
    delete newForm.date;
    delete newForm.time;

    setCurrentBook(newForm);
    await supabase.putAppointment({ ...newForm, student_id: user.id });
    await supabase.putNotification({
      title: "Appointment Request",
      content:
        user.last_name.slice(0, 1).toUpperCase() +
        user.last_name.slice(1) +
        " (" +
        user.student_number +
        ") is requesting an appointment. You can check it on appointments page",
      type: "request_appointment",
      student_id: 1,
    });
  };

  const deleteAppointment = async () => {
    setCurrentBook({});
    await supabase.deleteAppointment(user.id);
  };

  const send = async (message) => {
    setCanSend(false);
    const oldChats = chats;
    oldChats.push({ id: 0, is_student: true, content: message });
    supabase.putChats({
      student_id: user.id,
      is_student: true,
      content: message,
    });
    const result = JSON.parse(
      (await chatbot.reply(message)).slice(8).slice(0, -4),
    );
    //const result = { answer: "HELL NO", isBanned: false }; // AI-REPLACE
    oldChats.push({ id: 0, is_student: false, content: result.answer });
    setChats(oldChats);
    supabase.putChats({
      student_id: user.id,
      is_student: false,
      content: result.answer,
    });
    if (result.isBanned)
      setTimeout(() => {
        setCanSend(true);
      }, 1000 * 20);
    else setCanSend(true);
  };

  const computeStatus = async (basis) => {
    if (basis.length == 0) return;

    let oldestDay, oldestDate, newestDate;

    for (const current of basis) {
      if (oldestDate == null) {
        oldestDate = newestDate = current.date;
        continue;
      }

      oldestDate = current.date < oldestDate ? current.date : oldestDate;
      newestDate = current.date > newestDate ? current.date : newestDate;
    }
    oldestDay = new Date(oldestDate).getDay();

    function getMostRecentDay(targetDay) {
      const today = new Date();

      const diff = (today.getDay() - targetDay + 7) % 7;

      today.setDate(today.getDate() - diff);

      return today.toISOString().split("T")[0];
    }

    let startingDate = getMostRecentDay(oldestDay);

    function generateWeekData(globalArray, startDate) {
      const week = [];
      const current = new Date(startDate);

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // always generate exactly 7 days
      for (let i = 0; i < 7; i++) {
        const formattedDate = current.toISOString().split("T")[0];

        const found = globalArray.find((item) => item.date === formattedDate);

        week.push({
          mood: found ? found.mood : null,
          day: dayNames[current.getDay()],
          date: formattedDate,
        });

        current.setDate(current.getDate() + 1);
      }

      return week;
    }

    setJournWeek(generateWeekData(basis, startingDate));
  };

  const moodToEmoji = (mood) => {
    const value = mood?.toLowerCase();
    switch (value) {
      case "excited":
        return "⚡";
      case "content":
        return "🍀";
      case "drained":
        return "🌧";
      case "stressed":
        return "😤";
      default:
        return "⦸";
    }
  };

  const moodToColor = (mood) => {
    const value = mood?.toLowerCase();
    switch (value) {
      case "excited":
        return "yellow-100";
      case "content":
        return "green-100";
      case "drained":
        return "purple-100";
      case "stressed":
        return "red-100";
      default:
        return null;
    }
  };

  function capitalizeWords(sentence) {
    return sentence
      .split(" ")
      .map((word) => {
        if (!word) return "";

        return word
          .split("")
          .map((char, i) => {
            return i === 0 ? char.toUpperCase() : char.toLowerCase();
          })
          .join("");
      })
      .join(" ");
  }

  const restartEntries = () => {
    setEntries(
      Object.fromEntries(Object.keys(entries).map((key) => [key, null])),
    );
  };

  const updateJournal = async (journal) => {
    await supabase.updateJournal(dailyStatus.journal, user.id);
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
        firstDay,
        statusDays,
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
        availableSchedules,
        setCurrentBook,
        currentBook,
        bookAppointment,
        deleteAppointment,
        books,
        journWeek,
        moodToEmoji,
        moodToColor,
        updateJournal,
        reportPost,
        capitalizeWords,
        chats,
        canSend,
        send,
      }}
    >
      {children}
    </Variables.Provider>
  );
};

export const Variables = createContext();

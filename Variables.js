import { createContext, useState, useEffect } from "react";
import * as storage from "./services/storage";
import * as supabase from "./services/supabase";
import * as backend from "./services/backend";

export const Provider = ({ children }) => {
  // Mga variables na globally na gagamitin throughout ng app
  const [isLoaded, setIsLoaded] = useState(false);
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
  const [chosenTheme, setChosenTheme] = useState();
  // Yung mga variables na nasa baba na is mga temporary variable for journal at home page.
  // Malaki kasi data nila kung puro retrieve, baka magcause ng low performance
  // So iistore na natin sya statically
  const [dailyStatus, setDailyStatus] = useState();
  const [totalMood, setTotalMood] = useState(0);
  const [mostMood, setMostMood] = useState();
  const [curStreak, setCurStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [homeWeek, setHomeWeek] = useState([]);
  const [journWeek, setJournWeek] = useState([]);
  const [journMonth, setJournMonth] = useState([]);
  const [journYear, setJournYear] = useState([]);
  const [journEntry, setJournEntry] = useState([]);

  // Isesetup nya lang mga variables galing phone storage, kung meron lang or may nakalogin na user
  useEffect(() => {
    async function temp() {
      if (await storage.getUser()) setupData();
      else setIsLoaded(true);
      setChosenTheme(await storage.getChosenTheme());
    }
    temp();
  }, []);

  const setupData = async (result) => {
    const data = await storage.getAll();
    setStatusDays(data.statusDays);
    setDailyStatus(data.dailyStatus);
    setPendingPosts(data.pendingPosts);
    setPosts(data.posts);
    setMyposts(data.myPosts);
    setNotifications(data.notifications);
    setChats(data.chats);

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
    } else setDailyStatus(null);

    let temp = await backend.getSchedules();

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
    setIsLoaded(true);
  };

  const login = async (studentID, password) => {
    const result = await backend.login(studentID, password);

    if (result.success) {
      await storage.putUser(result.user);
      await storage.putStatusDays(result.statusDays);
      await storage.putPendingPost(result.pendingPosts);
      await storage.putPosts(result.posts);
      await storage.putMyPosts(result.myPosts);
      await storage.putNotifications(result.notifications);
      await storage.putAppointments(result.appointments);
      await storage.putChats(result.chats);
      await setupData();

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

  const signup = async (record) => {
    return await backend.putStudent(record);
  };

  const analyze = async () => {
    const relatePrevDays = 5;
    const relatedDates = [...statusDays]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, relatePrevDays);

    const result = await backend.assess(entries, relatedDates, user.id);

    setDailyStatus(result.result);

    await storage.putDailyStatus(result.result);

    const data = result.statusDay;

    delete data[0].account_id;
    setStatusDays([...statusDays, data[0]]);
    await storage.putStatusDays([...statusDays, data[0]]);
    computeStatus([...statusDays, data[0]]);
  };

  const deleteAll = function () {
    setUser({});
    setDailyStatus();
    setPendingPosts([]);
    setStatusDays([]);
    setEntries({
      door1: null,
      door2: null,
      door3: null,
      door4: null,
    });
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
  };

  const putPost = async (mood, text) => {
    const result = await backend.verifyPost(text);

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
    const relatePrevDays = 5;

    setCanSend(false);
    const oldChats = chats;
    oldChats.push({ id: 0, is_student: true, content: message });
    setChats(oldChats);
    supabase.putChats({
      student_id: user.id,
      is_student: true,
      content: message,
    });

    // AI's Prompt
    const relatedDates = [...statusDays]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, relatePrevDays);

    const result = await backend.chat(message, relatedDates);

    oldChats.push({ id: 0, is_student: false, content: result.answer });
    setChats(oldChats);
    supabase.putChats({
      student_id: user.id,
      is_student: false,
      content: result.answer,
    });
    storage.putChats(oldChats);
    if (result.isBanned)
      setTimeout(() => {
        setCanSend(true);
      }, 1000 * 20);
    else setCanSend(true);
  };

  const updateJournal = async () => {
    const newData = statusDays.map((current) => {
      if (current.date == new Date().toISOString().split("T")[0]) {
        return { ...current, journal: dailyStatus.journal };
      }
      return current;
    });
    setStatusDays(newData);

    await storage.putStatusDays(newData);

    await supabase.updateJournal(dailyStatus.journal, user.id);
  };

  const changeAnonymousName = async (newName) => {
    const newData = { ...user, anonymous_name: newName };
    setUser(newData);
    supabase.updateAnonymousName(newName, user.id);
    storage.putUser(newData);
  };

  const changePassword = async (password) => {
    return await supabase.updatePassword(password);
  };

  const changeTheme = async (theme) => {
    setChosenTheme(theme);
    storage.setChosenTheme(theme);
  };

  const computeStatus = async (basis) => {
    let oldestDay, oldestDate, newestDate;
    oldestDate = new Date().toISOString().split("T")[0];

    for (const current of basis) {
      if (oldestDate == null) {
        oldestDate = newestDate = current.date;
        continue;
      }

      oldestDate = current.date < oldestDate ? current.date : oldestDate;
      newestDate = current.date > newestDate ? current.date : newestDate;
    }
    oldestDay = new Date(oldestDate).getDay();

    if (basis.length > 0) {
      function getStreaks(data) {
        const dates = [...new Set(data.map((item) => item.date))].sort(
          (a, b) => new Date(b) - new Date(a),
        );

        const oneDay = 24 * 60 * 60 * 1000;

        const isConsecutive = (date1, date2) => {
          const d1 = new Date(date1);
          const d2 = new Date(date2);

          d1.setHours(0, 0, 0, 0);
          d2.setHours(0, 0, 0, 0);

          return (d1 - d2) / oneDay === 1;
        };

        // -------------------
        // BEST STREAK
        // -------------------
        let bestStreak = 1;
        let tempBest = 1;

        for (let i = 0; i < dates.length - 1; i++) {
          if (isConsecutive(dates[i], dates[i + 1])) {
            tempBest++;
          } else {
            tempBest = 1;
          }

          if (tempBest > bestStreak) {
            bestStreak = tempBest;
          }
        }

        // -------------------
        // CURRENT STREAK
        // -------------------
        const today = new Date();
        //today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const format = (d) => d.toISOString().split("T")[0];

        const todayStr = format(today);
        const yesterdayStr = format(yesterday);

        let currentStreak = 0;

        // Current streak only valid if today OR yesterday exists
        if (dates.includes(todayStr) || dates.includes(yesterdayStr)) {
          currentStreak = 1;

          const startIndex = dates.includes(todayStr)
            ? dates.indexOf(todayStr)
            : dates.indexOf(yesterdayStr);

          for (let i = startIndex; i < dates.length - 1; i++) {
            if (isConsecutive(dates[i], dates[i + 1])) {
              currentStreak++;
            } else {
              break;
            }
          }
        }

        return {
          currentStreak,
          bestStreak,
        };
      }
      const finalStreaks = getStreaks(basis);
      setBestStreak(finalStreaks.bestStreak);
      setCurStreak(finalStreaks.currentStreak);
    } else {
      setBestStreak(0);
      setCurStreak(0);
    }

    // MAJOR MOOD
    function getMajorMood(data) {
      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      const counts = {};

      for (const item of data) {
        if (!item.mood) continue;

        counts[item.mood] = (counts[item.mood] || 0) + 1;
      }

      let majorMood = null;
      let highest = 0;

      for (const mood in counts) {
        if (counts[mood] > highest) {
          highest = counts[mood];
          majorMood = mood;
        }
      }

      return majorMood;
    }
    setMostMood(getMajorMood(basis));

    function getMostRecentDay(targetDay) {
      const today = new Date();

      const diff = (today.getDay() - targetDay + 7) % 7;

      today.setDate(today.getDate() - diff);

      return today.toISOString().split("T")[0];
    }

    let startingDate = getMostRecentDay(oldestDay);

    const weekData = generateWeekData(startingDate, basis);
    setHomeWeek(weekData);
    setJournWeek(weekData);

    function getYearStatistics(data, year) {
      // Get only entries from the chosen year
      const filtered = data.filter(
        (item) => new Date(item.date).getFullYear() === year,
      );

      // TOTAL ENTRIES
      const total = filtered.length;

      // JOURNALS COUNT
      const journals = filtered.filter(
        (item) => item.journal != null && item.journal !== "",
      ).length;

      // MOST MOOD
      const moodCounts = {};

      filtered.forEach((item) => {
        moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
      });

      let mostMood = null;
      let highestMoodCount = 0;

      for (const mood in moodCounts) {
        if (moodCounts[mood] > highestMoodCount) {
          highestMoodCount = moodCounts[mood];
          mostMood = mood;
        }
      }

      // LONGEST STREAK
      const uniqueDates = [
        ...new Set(filtered.map((item) => item.date)),
      ].sort();

      let longestStreak = 0;
      let currentStreak = 0;

      for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0) {
          currentStreak = 1;
        } else {
          const prev = new Date(uniqueDates[i - 1]);
          const curr = new Date(uniqueDates[i]);

          const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

          if (diffDays === 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      }

      // MONTHS SUMMARY
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const months = [];

      for (let month = 0; month < 12; month++) {
        const monthData = filtered.filter(
          (item) => new Date(item.date).getMonth() === month,
        );

        let monthMostMood = null;

        if (monthData.length > 0) {
          const monthMoodCounts = {};

          monthData.forEach((item) => {
            monthMoodCounts[item.mood] = (monthMoodCounts[item.mood] || 0) + 1;
          });

          let highest = 0;

          for (const mood in monthMoodCounts) {
            if (monthMoodCounts[mood] > highest) {
              highest = monthMoodCounts[mood];
              monthMostMood = mood;
            }
          }
        }

        months.push({
          monthOrder: month,
          name: monthNames[month],
          total: monthData.length,
          mostMood: monthMostMood,
        });
      }

      return {
        total,
        longestStreak,
        mostMood,
        journals,
        months,
      };
    }

    setJournYear(getYearStatistics(basis, new Date().getFullYear()));
  };

  const generateWeekData = (startDate, basis = statusDays) => {
    const week = [];
    const current = new Date(startDate);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // always generate exactly 7 days
    for (let i = 0; i < 7; i++) {
      const formattedDate = current.toISOString().split("T")[0];

      const found = basis.find((item) => item.date === formattedDate);

      week.push({
        mood: found ? found.mood : null,
        day: dayNames[current.getDay()],
        date: formattedDate,
      });

      current.setDate(current.getDate() + 1);
    }

    return week;
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
        return "#eecc00";
      case "content":
        return "#00ee77";
      case "drained":
        return "#cc99ee";
      case "stressed":
        return "#bb0000";
      default:
        return null;
    }
  };

  const darkenColor = (hex, percent = 25) => {
    if (hex == null) return "#c59";
    // Remove #
    hex = hex.replace(/^#/, "");

    // Convert shorthand (#ca0) to full (#ccaa00)
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Darken each channel
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));

    // Convert back to hex
    const toHex = (v) => v.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  function capitalizeWords(sentence) {
    if (sentence == null) return null;
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

  function formatTime(timestamp) {
    const date = new Date(timestamp); // auto handles UTC → local
    const now = new Date();

    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // 🕒 Just now / seconds
    if (seconds < 60) return "just now";

    // ⏱ Minutes
    if (minutes < 60) return `${minutes}m ago`;

    // 🕐 Hours
    if (hours < 24) return `${hours}h ago`;

    // 📅 Yesterday
    if (days === 1) return "yesterday";

    // 📆 Days ago
    if (days < 7) return `${days}d ago`;

    // 🗓 Fallback to full date (e.g., Jan 18 | 6:38 PM)
    return date
      .toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " |");
  }

  const restartEntries = () => {
    setEntries(
      Object.fromEntries(Object.keys(entries).map((key) => [key, null])),
    );
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
        homeWeek,
        journWeek,
        setJournWeek,
        generateWeekData,
        moodToEmoji,
        moodToColor,
        updateJournal,
        reportPost,
        capitalizeWords,
        chats,
        canSend,
        send,
        curStreak,
        bestStreak,
        mostMood,
        journYear,
        changeAnonymousName,
        changePassword,
        isLoaded,
        formatTime,
        chosenTheme,
        changeTheme,
        darkenColor,
      }}
    >
      {children}
    </Variables.Provider>
  );
};

export const Variables = createContext();

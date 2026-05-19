import { supabase } from "../lib/supabase";
import * as Notifications from "expo-notifications";

export async function login(studentID, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${studentID}@moodlink.com`,
    password: password,
  });

  if (data.session) {
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("student_number", studentID)
      .single();

    if ((await Notifications.requestPermissionsAsync()).status == "granted") {
      const { data, error } = await supabase.from("token_devices").insert({
        student_id: student.id,
        token: (await Notifications.getExpoPushTokenAsync()).data,
      });
    }

    return { ...student, success: true };
  } else return { success: false };
}

export async function logout() {
  await supabase.auth.signOut();

  if ((await Notifications.requestPermissionsAsync()).status == "granted") {
    const { data, error } = await supabase
      .from("token_devices")
      .delete()
      .eq("token", (await Notifications.getExpoPushTokenAsync()).data);
  }
}

export async function putPendingPost(value) {
  const { data, error } = await supabase
    .from("pending_posts")
    .insert([value])
    .select();
  return { data: data, error: error };
}

export async function putPost(value) {
  const { data, error } = await supabase.from("posts").insert([value]).select();
  return { data: data, error: error };
}

export async function getStatusDays(id) {
  const { data, error } = await supabase
    .from("status_days")
    .select("date, id, journal, mood")
    .eq("account_id", id);
  return data;
}

export async function getPendingPosts(id) {
  const { data, error } = await supabase
    .from("pending_posts")
    .select("*")
    .eq("student_id", id)
    .order("id", { ascending: false });
  data.forEach((obj) => delete obj.student_id);
  data.forEach((obj) => delete obj.ai_say);
  return data;
}

export async function deletePendingPost(post_id) {
  const { error } = await supabase
    .from("pending_posts")
    .delete()
    .eq("id", post_id);
}

export async function deletePost(post_id) {
  const { error } = await supabase.from("posts").delete().eq("id", post_id);
}

export async function getPosts(id) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id, 
        mood,
        content,
        datetime,
        student_id,
        students (
                anonymous_name
        ),
        reactions (
                type,
                student_id
        )
        `,
    )
    .order("id", { ascending: false })
    .limit(7);

  function groupReactions(posts, currentUserId) {
    return posts.map((post) => {
      const counts = {};
      let myreact = null;

      post.reactions?.forEach((r) => {
        if (!r?.type) return;

        // detect your reaction
        if (r.student_id === currentUserId) {
          myreact = r.type;
          return; // 👈 skip counting your own reaction
        }

        // count others' reactions only
        counts[r.type] = (counts[r.type] || 0) + 1;
      });

      return {
        ...post,
        reactions: counts,
        myreact,
      };
    });
  }

  return groupReactions(data, id);
}

export async function getMyPosts(id) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id, 
        mood,
        content,
        datetime,
        student_id,
        reactions (
                type,
                student_id
        )
        `,
    )
    .eq("student_id", id)
    .order("id", { ascending: false });
  data.forEach((obj) => delete obj.student_id);

  function groupReactions(posts, currentUserId) {
    return posts.map((post) => {
      const counts = {};
      let myreact = null;

      post.reactions?.forEach((r) => {
        if (!r?.type) return;

        // detect your reaction
        if (r.student_id === currentUserId) {
          myreact = r.type;
          return; // 👈 skip counting your own reaction
        }

        // count others' reactions only
        counts[r.type] = (counts[r.type] || 0) + 1;
      });

      return {
        ...post,
        reactions: counts,
        myreact,
      };
    });
  }

  return groupReactions(data, id);
}

export async function updateReact(post_id, student_id, reaction) {
  if (reaction == null) {
    await supabase
      .from("reactions")
      .delete()
      .eq("post_id", post_id)
      .eq("student_id", student_id);
  } else {
    const { data, error } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", post_id)
      .eq("student_id", student_id);

    if (data.length > 0) {
      await supabase
        .from("reactions")
        .update({ type: reaction })
        .eq("post_id", post_id)
        .eq("student_id", student_id);
    } else {
      await supabase
        .from("reactions")
        .insert([{ post_id: post_id, student_id: student_id, type: reaction }]);
    }

    fetch(
      "http://192.168.0.100:3000/react",
      //"https://capstone-xuwy.onrender.com/",,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reactorId: student_id,
          postId: post_id,
          type: reaction,
        }),
      },
    );
  }
}

export async function getNotifications(user_id) {
  let { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("student_id", user_id)
    .order("id", { ascending: false });

  for (let current of data) {
    delete current.student_id;
  }
  return data;
}

export async function readNotification(notif_id, user_id) {
  if (notif_id != null)
    await supabase
      .from("notifications")
      .update({ is_seen: true })
      .eq("id", notif_id);
  else
    await supabase
      .from("notifications")
      .update({ is_seen: true })
      .eq("student_id", user_id);
}

export async function putNotification(args) {
  const { data, error } = await supabase.from("notifications").insert([
    {
      title: args.title,
      content: args.content,
      type: args.type,
      student_id: args.student_id,
    },
  ]);
}

let channel;
export async function realtime(setter, user_id) {
  channel = supabase
    .channel("notifications-" + user_id)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `student_id=eq.${user_id}`,
      },
      (payload) => {
        const data = payload.new;
        delete data.student_id;
        setter(data);
      },
    )
    .subscribe();
}

export async function removeRealtimeNotification() {
  supabase.removeChannel(channel);
}

export async function getSchedules() {
  let { data, error } = await supabase
    .from("available_schedules")
    .select("datetime");

  data = data.map((current) => {
    return current.datetime;
  });
  return data;
}

export async function putAppointment(args) {
  await supabase.from("appointments").insert([args]);
}

export async function deleteAppointment(user_id) {
  await supabase
    .from("appointments")
    .delete()
    .eq("student_id", user_id)
    .eq("status", "Pending");
}

export async function getAppointments(user_id) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("student_id", user_id)
    .order("id", { ascending: false });
  return data;
}

export async function updateDailyResult(result, user_id) {
  const { data, error } = await supabase
    .from("students")
    .update({ daily_result: result })
    .eq("id", user_id);
  return { data, error };
}

export async function putStatusDays(record) {
  const { data, error } = await supabase
    .from("status_days")
    .insert([record])
    .select();
  return { data, error };
}

export async function updateJournal(journal, user_id) {
  const { data, error } = await supabase
    .from("status_days")
    .update({ journal: journal })
    .eq("account_id", user_id)
    .eq("date", new Date().toISOString().split("T")[0]);
  return { data, error };
}

export async function updateFlagged(post_id) {
  await supabase.from("posts").update({ isReported: true }).eq("id", post_id);
}

export async function getStudent(user_id) {
  return (await supabase.from("students").select("*").eq("id", user_id))
    .data[0];
}

export async function getChats(user_id) {
  return (await supabase.from("chats").select("*").eq("student_id", user_id))
    .data;
}

export async function putChats(record) {
  await supabase.from("chats").insert([record]);
}

export async function updateAnonymousName(newName, user_id) {
  await supabase
    .from("students")
    .update({ anonymous_name: newName })
    .eq("id", user_id);
}

export async function putStudent(record) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("student_number", record.student_number);

  if (data.length == 0) {
    await supabase.from("students").upsert(record);
    return { success: true };
  } else if (data[0].status != "verified") {
    await supabase.from("students").upsert(record, {
      onConflict: "student_number",
    });
    return { success: true };
  } else return { success: false };
}

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  return { data, error };
}

export async function tae() {
  const token = await registerForPushNotificationsAsync();

  if (!token) {
    const { data, error } = await supabase.from("user_push_tokens").upsert({
      user_id: 2,
      expo_token: token,
    });
  }

  const { data: tokens } = await supabase
    .from("user_push_tokens")
    .select("expo_token")
    .eq("user_id", 2);

  await sendPushNotification({
    expoTokens: tokens.map((t) => t.expo_token),
    title: "New message 💬",
    body: "TALAGA BARNN?",
    data: { user_id: 2 },
  });
}

import { supabase } from "../lib/supabase";
import * as Notifications from "expo-notifications";

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
    .select("id, mood, content");
  return { data: data[0], error };
}

export async function putPost(value) {
  const { data, error } = await supabase
    .from("posts")
    .insert([value])
    .select("id, mood, content, datetime");
  return { data: data[0], error };
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
      //"https://capstone-xuwy.onrender.com/react",
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

//if ((await Notifications.requestPermissionsAsync()).status == "granted") {

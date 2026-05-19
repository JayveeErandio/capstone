// INITIALIZATION
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

// NOTIFICATION SETUP
const notify = async (receiverToken, title, body) => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: receiverToken,
      title: title,
      body: body,
    }),
  });
};

// EXTERNAL SECRET APIs
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// URL APIs
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend JAJAJA" });
});

app.post("/react", async (req, res) => {
  const { reactorId, postId, type } = req.body;

  let value;
  const reactorAnonymousName = (
    await supabase.from("students").select().eq("id", reactorId)
  ).data[0].anonymous_name;

  value = (
    await supabase.from("posts").select("student_id, content").eq("id", postId)
  ).data[0];
  const postContent = value.content;

  value = (
    await supabase
      .from("token_devices")
      .select()
      .eq("student_id", value.student_id)
  ).data;

  let phrase;
  switch (type) {
    case "love":
      phrase = "loved";
      break;
    case "funny":
      phrase = "laughed to";
      break;
    case "sad":
      phrase = "felt sad about";
      break;
  }

  for (let device of value)
    notify(
      device.token,
      reactorAnonymousName + " " + phrase + " your post",
      'Your post "' + postContent + '" was reacted',
    );

  res.json({ received: true });
});

/*
  //await fetch("https://exp.host/--/api/v2/push/send", {
  //  method: "POST",
  //  headers: { "Content-Type": "application/json" },
  //  body: JSON.stringify({
  //    to: "ExponentPushToken[KBtjC8I7t6-P-4sz3WpVPS]",
  //    title: "Backend Notification 🚀",
  //    body: "Sent from Node backend",
  //  }),
  //});
*/

app.get("/students", async (req, res) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id", { ascending: false });
  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// INITIALIZATION
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import crypto from "crypto";
import { Resend } from "resend";
import Profanity from "./profanity.js";

dotenv.config();
const app = express();
app.use(express.json());

// NOTIFICATION
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

// SUPABASE
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON,
);

// CHATBOT
async function askAI(question, retries = 5, delay = 2000) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: question,
    });
    console.log(response.output_text);
    return response.output_text;
  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("MESSAGE:", error.message);
    console.error("CAUSE:", error.cause);

    throw error;
  }
  return;
}
async function assess(entries, relates) {
  return await askAI(
    `
Return an answer in a stringified JSON with a structure like the example below:
{
  comment: "You've been riding this buzz for a few days. That's great!",
  suggestions: [
    {
      title: "Celebrate with Others",
      details: "Share your good energy",
      icon: "🎉"
    },
    {
      title: "Reach Out",
      details: "Connect with a friend",
      icon: "💬"
    },
    {
      title: "Community Events",
      details: "GCU social activities ",
      icon: "🤝"
    }
  ],
  followup: "🤔 Who gave you good energy today?"
}

EXPLANATION: You can generate any amount of suggestions but maybe atleast one up to five only, but still refer to what depends. The title and details of a suggestion, comment, and followup must just short sentence like the examples above. And lastly, at the followup, always include an emoji at the start

To answer this, base the input below that is about a student's mood in a day:
{
  door1: "` +
      entries.door1 +
      `",
  door2: "` +
      entries.door2 +
      `",
  door3: "` +
      entries.door3 +
      `",
  door4: "` +
      entries.door4 +
      `",
}
EXPLANATION: Door1 means the energy of the user. Door2 means the duration of that his/her feeling. Door3 means his heart feels, this is where already whether positive or negative his mood, light means positive, heavy means negative. Door4 means the context or aspect where his mood came from.  And lastly, you must relate to the previous days history below, which the user who entried this has done before

RELATED DATA: ` +
      JSON.stringify(relates) +
      `

NOTE: Return only the plain text in a format of JSON stringified object or expected return answer. Don't explain it. Just return it with the pure text string only. Dont build any code, just the answer`,
  );
}
async function verifyPost(text) {
  return await askAI(
    `
Return an answer in a stringified JSON with a structure like the example below:
{
  isAllowed: false,
  reason: "He sounds suiciding now. Give urgent."
}
EXPLANATION: the "isAllowed" can only have a value true or false. Base it whether the words is profanity or bad words, or the meaning of the input is something needed to give urgent attention or warning to. Example, return false if it has like "fuck", "bitch", etc. If the "isAllowed" is true, dont give reason, else give the reason why. In order to answer this, base the input about the student's saying:

"` +
      text +
      `"

NOTE: Return only the plain text in a format of JSON stringified object or expected return answer. Don't explain it. Just return it with the pure text string only. Dont build any code, just the answer
  `,
  );
}
async function reply(message, relates) {
  return await askAI(
    `
Return an answer in a stringified JSON with a structure like the example below:
{
  answer: "",
  isBanned: false
}

And the question/message is this: "` +
      message +
      `"

EXPLANATION: Answer or message back it as the usual you. But here is the instruction: you can message back except when the topic or meaning of the question is not related about psychology, mood, emotion, wellbeing, or anything that is related to psychological. Example, when the question is "7+8?", reply it that you don't tolerate or entertain and remind that you only entertain the allowed said topic. And that's the time that you must set that "isBanned" to true. And if so, tell also that his chat will be banned for 1 hour. And lastly, you must relate to the previous days history below, which the user who messaged this has entried

RELATED DATA: ` +
      JSON.stringify(relates) +
      `

NOTE: Return only the plain text in a format of JSON stringified object or expected return answer. Don't explain it. Just return it with the pure text string only. Dont build any code, just the answer    `,
  );
}

// URL APIs
app.get("/", (req, res) => {
  res.json({ message: "" });
});

app.post("/login", async (req, res) => {
  const { studentNumber, password } = req.body;

  // Student
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("student_number", studentNumber)
    .single();

  //Ichechek muna kung hindi deactivated or hindi banned yung account nya
  if (student.status == "suspended" || student.status == "deactivated") {
    res.json({ success: false, reason: "deactivated" });
    return;
  }

  // Status Days
  const { data: statusDays } = await supabase
    .from("status_days")
    .select("date, id, journal, mood")
    .eq("account_id", student.id);

  const { data: statusWeeks } = await supabase
    .from("status_weeks")
    .select()
    .eq("student_id", student.id);

  // Pending Posts
  const { data: pendingPosts } = await supabase
    .from("pending_posts")
    .select("id, mood, content")
    .eq("student_id", student.id)
    .order("id", { ascending: false });

  // Just a special function for posts and myposts
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

  // Posts
  const { data: posts } = await supabase
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
    .neq("status", "flagged")
    .order("id", { ascending: false })
    .limit(7);
  12;
  const { data: myPosts } = await supabase
    .from("posts")
    .select(
      `
              id, 
              mood,
              content,
              datetime,
              reactions (
                      type,
                      student_id
              )
              `,
    )
    .eq("student_id", student.id)
    .order("id", { ascending: false });

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, title, content, is_seen, datetime")
    .eq("student_id", student.id)
    .order("id", { ascending: false });

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("student_id", student.id)
    .order("id", { ascending: false });

  const { data: chats } = await supabase
    .from("chats")
    .select("*")
    .eq("student_id", student.id);

  res.json({
    user: { ...student, success: true },
    statusDays: statusDays,
    statusWeeks: statusWeeks,
    pendingPosts: pendingPosts,
    posts: groupReactions(posts, student.id),
    myPosts: groupReactions(myPosts, student.id),
    notifications: notifications,
    appointments: appointments,
    chats: chats,
    success: true,
  });
});

app.post("/signup", async (req, res) => {
  let { record } = req.body;
  record = JSON.parse(record);
  console.log("Signing up by", record.student_number);

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("student_number", record.student_number);

  if (data.length == 0) {
    const { data: datum, error: errum } = await supabase
      .from("students")
      .upsert(record);

    res.json({ success: true });
  } else if (data[0].status != "verified") {
    await supabase.from("students").upsert(record, {
      onConflict: "student_number",
    });
    res.json({ success: true });
  } else res.json({ success: false });
});

app.post("/ai/assess", async (req, res) => {
  const { entries, relatedDates, userID } = req.body;
  let feedback = await assess(entries, relatedDates);
  if (feedback[0] == "`") feedback = feedback.slice(8).slice(0, -4);
  const result = JSON.parse(feedback);

  await supabase
    .from("students")
    .update({ daily_result: result })
    .eq("id", userID);

  const newdata = {
    mood:
      entries.door1 == "High"
        ? entries.door3 == "Light"
          ? "excited"
          : "stressed"
        : entries.door3 == "Light"
          ? "content"
          : "drained",
    date: new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    }),
    account_id: userID,
  };

  const { data, error } = await supabase
    .from("status_days")
    .insert([newdata])
    .select();

  res.json({ result: result, statusDay: data });
});

app.post("/ai/assessFree", async (req, res) => {
  const { entries } = req.body;
  let feedback = await assess(entries, []);
  if (feedback[0] == "`") feedback = feedback.slice(8).slice(0, -4);
  const result = JSON.parse(feedback);
  res.json({ result: result });
});

app.post("/ai/verifypost", async (req, res) => {
  const { text } = req.body;
  let result;
  if (Profanity(text).hasProfanity) {
    // First undergo to dictionary list premade
    result = { isAllowed: false, reason: "Contains profanity" };
    console.log("Immediately detected in profanity list:", result);
  } else {
    let feedback = await verifyPost(text);
    if (feedback[0] == "`") feedback = feedback.slice(8).slice(0, -4);
    result = JSON.parse(feedback);
  }
  res.json(result);
});

app.post("/ai/chat", async (req, res) => {
  const { message, relatedDates } = req.body;
  let feedback = await reply(message, relatedDates);
  if (feedback[0] == "`") feedback = feedback.slice(8).slice(0, -4);
  const result = JSON.parse(feedback);
  res.json(result);
});
12;
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

app.post("/getSchedules", async (req, res) => {
  const { data } = await supabase
    .from("available_schedules")
    .select("datetime")
    .is("takenBy", null)
    .order("datetime", { ascending: true });

  res.json(
    data.map((current) => {
      return current.datetime;
    }),
  );
});

app.post("/getMorePosts", async (req, res) => {
  const { postID, userID } = req.body;

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
    .neq("status", "flagged")
    .lt("id", postID)
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

  res.json(groupReactions(data, userID));
});

app.post("/console", async (req, res) => {
  console.log(req.body.value);
});

app.post("/forgotPassword", async (req, res) => {
  function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyz";

    let password = "";

    for (let i = 0; i < 11; i++) {
      if (i == 3) {
        password += ".";
        continue;
      } else if (i == 7) {
        password += ",";
        continue;
      }
      const index = crypto.randomInt(0, chars.length);
      password += chars[index];
    }

    return password;
  }

  const { student_number, email } = req.body;
  const { data } = await supabase
    .from("students")
    .select()
    .eq("student_number", student_number)
    .eq("personal_email", email.trim())
    .single();

  if (!data) {
    res.json({ status: "invalid" });
    return;
  }

  const generated = generatePassword();
  const { data: aso, error: pusa } = await supabase.auth.admin.updateUserById(
    data.uuid,
    { password: generated },
  );

  const resend = new Resend("re_2WRpYfzu_LWvKMDq4ptyPvuremVd2nGdB");
  await resend.emails.send({
    from: "MoodLink <noreply@feumoodlink.com>",
    to: email.trim(),
    subject: "Your Temporary MoodLink Password",
    html:
      `
    <p>Hello,</p>
<p>We received a request to reset the password for your MoodLink account.</p>
<p>A temporary password has been generated for you:</p>
<p>Temporary Password: <strong>` +
      generated +
      `</strong></p>
<p>Please use this password to log in to your account. For your security, change your password immediately after signing in.</p>
<p>If you did not request this password reset, your account may have been accessed by someone else. Please log in as soon as possible using the temporary password above and change your password to one that only you know.</p>
    `,
  });

  res.json({ status: "success" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Backend's automated actions =========================

// Deletion of Notifications older than 30 days
async function autoDelNotif() {
  let today = new Date();
  today.setDate(today.getDate() - 28);

  const { data, error } = await supabase
    .from("notifications")
    .delete("*")
    .lte("datetime", today.toISOString());
  console.log("Old notifications deleted");
}

autoDelNotif();
setInterval(async function () {
  autoDelNotif();
}, 43200000);

async function tae() {
  //const { data } = await supabase.auth.signInWithPassword({
  //  email: `jayveeerandio13@gmail.com`,
  //   password: "gerygery",
  // });
  // console.log(data);
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // console.log(user?.id);
  // await supabase.auth.admin.deleteUser(user?.id);
}

//tae();

// INITIALIZATION
import express from "express";
import dotenv from "dotenv";
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
  process.env.SUPABASE_KEY,
);

// CHATBOT
async function askAI(question, retries = 5, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
          process.env.GOOGLEAI_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: question }],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        console.log(`Attempt ${attempt} failed:`, data.error.message);

        if (attempt === retries) {
          return "AI is busy right now. Please try again later.";
        }

        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    } catch (error) {
      console.error(`Attempt ${attempt} error:`, error);

      if (attempt === retries) {
        return "Network error. Please try again.";
      }

      await new Promise((res) => setTimeout(res, delay));
    }
  }
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
  res.json({ message: "Hello from backend JAJAJA" });
});

app.post("/login", async (req, res) => {
  console.log(232323);
  const { studentNumber, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${studentNumber}@moodlink.com`,
    password: password,
  });

  //If no account exists
  if (!data.session) {
    res.json({ success: false });
    return;
  }

  //If exists, following command proceed below

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
    .order("id", { ascending: false })
    .limit(7);

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

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("student_number", record.student_number);

  if (data.length == 0) {
    await supabase.from("students").upsert(record);
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
  const result = JSON.parse(
    (await assess(entries, relatedDates)).slice(8).slice(0, -4),
  );

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
    date: new Date().toISOString().split("T")[0],
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
  const result = JSON.parse((await assess(entries, [])).slice(8).slice(0, -4));
  res.json({ result: result });
});

app.post("/ai/verifypost", async (req, res) => {
  const { text } = req.body;
  const result = JSON.parse((await verifyPost(text)).slice(8).slice(0, -4));
  res.json(result);
});

app.post("/ai/chat", async (req, res) => {
  const { message, relatedDates } = req.body;
  const result = JSON.parse(
    (await reply(message, relatedDates)).slice(8).slice(0, -4),
  );
  res.json(result);
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

app.post("/getSchedules", async (req, res) => {
  const { data } = await supabase
    .from("available_schedules")
    .select("datetime")
    .eq("isTaken", false)
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

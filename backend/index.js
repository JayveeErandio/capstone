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

app.post("/ai/assess", async (req, res) => {
  const { entries, relatedDates } = req.body;
  const result = JSON.parse(
    (await assess(entries, relatedDates)).slice(8).slice(0, -4),
  );
  res.json(result);
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

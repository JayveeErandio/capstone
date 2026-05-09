const API_KEY = process.env.EXPO_PUBLIC_GOOGLEAI_KEY;

async function askAI(question, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
          API_KEY,
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

      // 🔥 If API returned an error (like 503)
      if (data.error) {
        console.log(`Attempt ${attempt} failed:`, data.error.message);

        // if last attempt, return message
        if (attempt === retries) {
          return "AI is busy right now. Please try again later.";
        }

        // wait before retrying
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      // ✅ success
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    } catch (error) {
      console.error(`Attempt ${attempt} error:`, error);

      if (attempt === retries) {
        return "Network error. Please try again.";
      }

      // wait before retry
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export async function askMood(entries) {
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
EXPLANATION: Door1 means the energy of the user. Door2 means the duration of that his/her feeling. Door3 means his heart feels, this is where already whether positive or negative his mood, light means positive, heavy means negative. Door4 means the context or aspect where his mood came from.

NOTE: Return only the plain text in a format of JSON stringified object or expected return answer. Don't explain it. Just return it with the pure text string only. Dont build any code, just the answer`,
  );
}

export async function verifyPost(text) {
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

export async function reply(message) {
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

EXPLANATION: Answer or message back it as the usual you. But here is the instruction: you can message back except when the topic or meaning of the question is not related about psychology, mood, emotion, wellbeing, or anything that is related to psychological. Example, when the question is "7+8?", reply it that you don't tolerate or entertain and remind that you only entertain the allowed said topic. And that's the time that you must set that "isBanned" to true. And if so, tell also that his chat will be banned for 1 hour.
NOTE: Return only the plain text in a format of JSON stringified object or expected return answer. Don't explain it. Just return it with the pure text string only. Dont build any code, just the answer
    `,
  );
}

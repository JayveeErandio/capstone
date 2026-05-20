async function call(url, args) {
  const response = await fetch(
    //"http://192.168.0.100:3000" + url,
    "https://capstone-xuwy.onrender.com" + url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    },
  );
  return await response.json();
}

export async function chat(message, relatedDates) {
  return await call("/ai/chat", {
    message: message,
    relatedDates: relatedDates,
  });
}

export async function verifyPost(text) {
  return await call("/ai/verifypost", { text: text });
}

export async function assess(entries, relatedDates) {
  return await call("/ai/assess", {
    entries: entries,
    relatedDates: relatedDates,
  });
}

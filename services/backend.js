async function call(url, args) {
  const response = await fetch(
    "http://192.168.0.105:3000" + url,
    //"https://capstone-xuwy.onrender.com" + url,
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

export async function assess(entries, relatedDates, userID) {
  return await call("/ai/assess", {
    entries: entries,
    relatedDates: relatedDates,
    userID: userID,
  });
}

export async function login(studentNumber, password) {
  return await call("/login", {
    studentNumber: studentNumber,
    password: password,
  });
}

export async function getSchedules() {
  return await call("/getSchedules");
}

export async function putStudent(record) {
  return await call("/signup", {
    record: JSON.stringify(record),
  });
}

export async function putStatusDay(statusDay, dailyResult, userID) {
  return await call("/putStatusDay", {
    statusDay: statusDay,
    dailyResult: dailyResult,
    userID: userID,
  });
}

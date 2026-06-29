async function call(url, args) {
  const response = await fetch(
    //"http://192.168.0.105:3000" + url,
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
  const data = await call("/ai/chat", {
    message: message,
    relatedDates: relatedDates,
  });

  return data;
}

export async function verifyPost(text) {
  return await call("/ai/verifypost", { text: text });
}

export async function assess(entries, relatedDates, userID) {
  const data = await call("/ai/assess", {
    entries: entries,
    relatedDates: relatedDates,
    userID: userID,
  });
  return data;
}

export async function assessFree(entries) {
  return await call("/ai/assessFree", {
    entries: entries,
  });
}

export async function login(studentNumber, password) {
  const data = await call("/login", {
    studentNumber: studentNumber,
    password: password,
  });
  return data;
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

export async function getMorePosts(postID, userID) {
  return await call("/getMorePosts", { postID: postID, userID: userID });
}

export async function consolelog(value) {
  await call("/console", { value: value });
}

export async function forgotPassword(student_number, email) {
  return await call("/forgotPassword", {
    student_number: student_number,
    email: email,
  });
}

export async function connect() {
  return await call("/connect");
}

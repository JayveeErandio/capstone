import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredUser = async () => {
  const data = await AsyncStorage.getItem("user");
  const textual = JSON.parse(data);
  return textual;
};

export const loginUser = async (studentID, password) => {
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

    const value = { ...student, success: true };
    const temp = async () => {
      await AsyncStorage.setItem("user", JSON.stringify(value));
    };
    temp();
    return value;
  }

  return { success: false };
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
  await AsyncStorage.removeItem("user");
  const { data } = await supabase.auth.getSession();
};

export const signupUser = async (ID) => {
  const { data, error } = await supabase.from("notifications").insert([
    {
      account_id: 1,
      text_content: `Student with a student-number ${ID} has requested account creation.`,
      type: "register",
      is_seen: false,
    },
  ]);
};

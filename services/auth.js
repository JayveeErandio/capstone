import { supabase } from "../lib/supabase";

export const loginUser = async (studentID, password) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("student_number", studentID)
    .eq("password", password)
    .single();

  if (error || !data) {
    return { success: false };
  }

  return {
    ...data,
    success: true,
  };
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

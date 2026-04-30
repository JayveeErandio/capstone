import { supabase } from "../lib/supabase";

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

    return { ...student, success: true };
  }

  return { success: false };
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

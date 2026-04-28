import { supabase } from "../lib/supabase";
// checks students table in Supabase
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
    success: true,
    user: data,
  };
};

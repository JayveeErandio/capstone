import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  "https://rpeqlerchayltgthzwve.supabase.co", //process.env.EXPO_PUBLIC_SUPABASE_URL,
  "sb_publishable_LsS2PqcBQ9HxsWKt-nYL5w_62O1qwGi", //process.env.EXPO_PUBLIC_SUPABASE_KEY,
);

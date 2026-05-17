import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// APIs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

app.get("/", (req, res) => {
  res.json({ message: "Hello from backend HAHAHA" });
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

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";


dotenv.config({ path: "../.env" }); // 👈 tells Node to load from project root


const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Read from Vite-style env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
const PORT = process.env.PORT || 8080;

// 🧩 Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Route: Match users to tasks using AI service
app.post("/match", async (req, res) => {
  try {
    const { user_id, task_id } = req.body;

    if (!user_id || !task_id) {
      return res.status(400).json({ error: "user_id and task_id are required" });
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError || !profileData) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Fetch task data
    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", task_id)
      .single();

    if (taskError || !taskData) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Send both to the AI service
    const aiResponse = await axios.post(AI_SERVICE_URL, {
      user: profileData,
      task: taskData,
    });

    // Forward the AI’s response back
    res.json({
      user_id,
      task_id,
      match_result: aiResponse.data,
    });
  } catch (error) {
    console.error("Error in /match:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

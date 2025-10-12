import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Supabase setup ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// --- /match endpoint ---
app.post("/match", async (req, res) => {
  const { user_id, task_id } = req.body;
  if (!user_id || !task_id)
    return res.status(400).json({ error: "user_id and task_id required" });

  try {
    // 1️⃣ Fetch user skills
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, name, skills")
      .eq("id", user_id)
      .single();

    if (userError || !userData)
      return res.status(404).json({ error: "User not found" });

    // 2️⃣ Fetch task requirements
    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .select("id, title, requirements")
      .eq("id", task_id)
      .single();

    if (taskError || !taskData)
      return res.status(404).json({ error: "Task not found" });

    // 3️⃣ Send both to AI service
    const aiResponse = await fetch("http://localhost:8088/ai/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_skills: userData.skills,
        task_requirements: taskData.requirements,
      }),
    });

    const aiResult = await aiResponse.json();

    // 4️⃣ Return final formatted response
    const formattedResponse = {
      user_id,
      task_id,
      match_score: aiResult.match_score ?? 0,
      comment:
        aiResult.comment ??
        "AI did not return a comment. Check /ai/match service.",
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error("Error in /match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => console.log(`✅ Match service running on port ${PORT}`));

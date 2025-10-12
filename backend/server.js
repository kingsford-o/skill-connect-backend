import express from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/match", async (req, res) => {
  const { user_id, task_id } = req.body;

  if (!user_id || !task_id) {
    return res.status(400).json({ error: "user_id and task_id are required" });
  }

  try {
    // Fetch user and task from Supabase
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", task_id)
      .single();

    if (userError || taskError || !userData || !taskData) {
      return res.status(404).json({ error: "User or Task not found" });
    }

    // Extract relevant info
    const userText = `${userData.name || ""} ${userData.bio || ""} ${userData.location || ""}`.toLowerCase();
    const requirements = taskData.requirements || [];

    // Simple matching logic: count requirement words found in user's bio/name
    let matched = 0;
    for (const req of requirements) {
      if (userText.includes(req.toLowerCase())) matched++;
    }

    const matchScore = requirements.length > 0 ? matched / requirements.length : 0;
    const comment =
      matchScore > 0.7
        ? `Strong match based on ${matched} overlapping skills`
        : matchScore > 0.3
        ? `Partial match found (${matched}/${requirements.length})`
        : `Weak match – few relevant terms`;

    // Return response
    return res.json({
      user_id,
      task_id,
      match_score: parseFloat(matchScore.toFixed(2)),
      comment,
    });
  } catch (err) {
    console.error("Error in /match:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

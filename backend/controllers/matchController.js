import axios from "axios";
import { supabase } from "../supabaseClient.js";

export const matchUserToTask = async (req, res) => {
  try {
    const { user_id, task_id } = req.body;

    // 1. Fetch user profile
    const { data: userData, error: userErr } = await supabase
      .from("profiles")
      .select("skills")
      .eq("id", user_id)
      .single();

    if (userErr) throw userErr;

    // 2. Fetch task info
    const { data: taskData, error: taskErr } = await supabase
      .from("tasks")
      .select("requirements")
      .eq("id", task_id)
      .single();

    if (taskErr) throw taskErr;

    // 3. Send to local AI service
    const { data: aiResponse } = await axios.post("http://localhost:8088/ai/match", {
      user_skills: userData.skills,
      task_requirements: taskData.requirements,
    });

    // 4. Return result
    res.json({
      user_id,
      task_id,
      match_score: aiResponse.match_score,
      comment: aiResponse.comment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

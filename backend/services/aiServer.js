import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// POST /ai/match
app.post("/ai/match", (req, res) => {
  try {
    const { user, task } = req.body;

    console.log("AI received:", req.body);

    if (!user || !task) {
      return res.status(400).json({ error: "Missing user or task data" });
    }

    const userSkills = Array.isArray(user.skills) ? user.skills : [];
    const taskRequirements = Array.isArray(task.requirements) ? task.requirements : [];

    // Basic matching logic
    const matched = taskRequirements.filter(req =>
      userSkills.map(s => s.toLowerCase()).includes(req.toLowerCase())
    );

    const matchScore = taskRequirements.length
      ? matched.length / taskRequirements.length
      : 0;

    const comment =
      matchScore > 0.8
        ? "Excellent match"
        : matchScore > 0.5
        ? "Good partial match"
        : "Low match";

    res.json({
      match_score: parseFloat(matchScore.toFixed(2)),
      comment,
      matched_skills: matched
    });
  } catch (err) {
    console.error("Error in AI service:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => console.log("🤖 AI Service running on port 5000"));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Swagger setup inline (no external file)
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skill Connect Messaging API",
      version: "1.0.0",
      description: "API for managing conversations and messages",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./server.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Conversations
 *     description: Conversation management
 *   - name: Messages
 *     description: Message sending and retrieval
 */

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participants
 *             properties:
 *               type:
 *                 type: string
 *                 example: private
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["uuid1", "uuid2"]
 *               title:
 *                 type: string
 *                 example: "Project Chat"
 *     responses:
 *       201:
 *         description: Conversation created successfully
 */
app.post("/conversations", async (req, res) => {
  try {
    const { type = "private", participants, title } = req.body;
    if (!participants || participants.length === 0)
      return res.status(400).json({ error: "Participants required" });

    const { data, error } = await supabase
      .from("conversations")
      .insert([{ type, participants, title }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - sender_id
 *               - content
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 example: "uuid-of-conversation"
 *               sender_id:
 *                 type: string
 *                 example: "uuid-of-sender"
 *               content:
 *                 type: string
 *                 example: "Hello there!"
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://file.jpg"]
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
app.post("/messages", async (req, res) => {
  try {
    const { conversation_id, sender_id, content, attachments = [], status = "sent" } = req.body;
    if (!conversation_id || !sender_id || !content)
      return res.status(400).json({ error: "conversation_id, sender_id, and content required" });

    const { data, error } = await supabase
      .from("messages")
      .insert([{ conversation_id, sender_id, content, attachments, status }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Fetch messages for a conversation
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 */
app.get("/messages", async (req, res) => {
  try {
    const { conversation_id } = req.query;
    if (!conversation_id)
      return res.status(400).json({ error: "conversation_id is required" });

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅
Server running on http://localhost:${PORT}`));
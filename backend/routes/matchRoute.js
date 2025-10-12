import express from "express";
import { matchUserToTask } from "../controllers/matchController.js";

const router = express.Router();

router.post("/", matchUserToTask);

export default router;

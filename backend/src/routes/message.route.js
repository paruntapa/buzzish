import express from "express";
import { middlewareRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.contoller.js";

const router = express.Router();

router.get("/users", middlewareRoute, getUserForSidebar)
router.get("/:id", middlewareRoute, getMessages)
router.post("/send/:id", middlewareRoute, sendMessage)

export default router
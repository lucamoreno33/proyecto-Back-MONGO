import express  from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import chatController from "../controllers/chat.controller.js";
const router = express.Router();

router.get("/", authorization("user"), chatController.chatRender)

export default router
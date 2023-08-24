import { Router } from "express";
import cartsRouter from "./carts.router.js"
import chatRouter from "./chat.router.js"
import productsRouter from "./products.router.js"
import sessionsRouter from "./sessions.router.js"
import viewsRouter from "./views.router.js"

const router = Router();

router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/chat", chatRouter);
router.use("/api/sessions", sessionsRouter)

export default router;
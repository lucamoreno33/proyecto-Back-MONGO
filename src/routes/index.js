import { Router } from "express";
import cartsRouter from "./carts.router.js"
import chatRouter from "./chat.router.js"
import productsRouter from "./products.router.js"
import sessionsRouter from "./sessions.router.js"
import viewsRouter from "./views.router.js"
import { createTransport } from "nodemailer";

const TEST_MAIL = "cheyanne.haley@ethereal.email"
const PASS = "Yswf6NP2MUepWaBQgg"

const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: PASS
    }
});

const emailContent = {
    from: TEST_MAIL,
    to: TEST_MAIL,
    subject: "testing nodemailer",
    text: "hello world",
    html: "<div><h1 style='color: brown'>probando nodemailer<h1><img src='cid:capraDemon'><div>",
    attachments: [{
        filename: "capraDemon.jpg",
        path: "../imgs/capraDemon.jpg",
        cid: "capraDemon"
    }]

}

try {
    const info = await transporter.sendMail(emailContent)
    console.log(info)
} catch (error) {
    console.log("error", error);    
}









const router = Router();

router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/chat", chatRouter);
router.use("/api/sessions", sessionsRouter)

export default router;
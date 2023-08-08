import express  from "express";
import authorization from "../middlewares/authorization.middlewares.js";
const router = express.Router();

router.get("/", authorization("user"), (req, res) =>{
    res.render("chat", {});
})

export default router
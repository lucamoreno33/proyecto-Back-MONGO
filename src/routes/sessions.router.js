import { Router } from "express";
import passport from "passport";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router();

router.post('/register', passport.authenticate("register"), sessionsController.registerSuccess)

router.post("/login", passport.authenticate("login"), sessionsController.login)

router.get("/github", passport.authenticate("github"))

router.get("/githubcallback", passport.authenticate("github"), sessionsController.githubcallback)

router.post("/logout", sessionsController.logout)


export default router
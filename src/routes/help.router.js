import { Router } from "express";
import helpersController from "../controllers/user.controller.js";
import authorization from "../middlewares/authorization.middlewares.js";

const router = Router();

router.post("/passwordRecoveryMail", authorization(["user", "premium", "ADMIN"]), helpersController.passwordRecoveryMail)

router.get("/passwordRecovery/:token", authorization(["user", "premium", "ADMIN"]), helpersController.passwordRecoveryRender)

router.post("/passwordRecovery", authorization(["user", "premium", "ADMIN"]), helpersController.passwordRecovery)

export default router
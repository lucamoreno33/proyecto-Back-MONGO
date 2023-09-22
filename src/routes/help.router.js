import { Router } from "express";
import helpersController from "../controllers/helpers.controller.js";

const router = Router();

router.post("/passwordRecoveryMail", helpersController.passwordRecoveryMail)

router.get("/passwordRecovery/:token", helpersController.passwordRecoveryRender)

router.post("/passwordRecovery", helpersController.passwordRecovery)

export default router
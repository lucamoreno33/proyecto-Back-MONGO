import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import helpersController from "../controllers/helpers.controller.js";

const router = Router();

router.put("/premium/:uid",authorization("ADMIN"), helpersController.changeRole)


export default router
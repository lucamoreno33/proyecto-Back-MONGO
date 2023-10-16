import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import userController from "../controllers/user.controller.js";
import upload from "../middlewares/multerUpload.middleware.js";

const router = Router();

router.get("/premium/:uid",authorization(["user", "premium"]), userController.changeRole)

router.post("/:uid/documents",authorization(["user", "premium"]), upload.array("file"), userController.uploadDocuments )

export default router
import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import userController from "../controllers/user.controller.js";
import upload from "../middlewares/multerUpload.middleware.js";

const router = Router();

router.get("/", authorization("ADMIN"), userController.getUsers)

router.get("/premium/:uid",authorization(["user", "premium"]), userController.changeRole)

router.post("/:uid/documents",authorization(["user", "premium"]), upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'document', maxCount: 1 },]), 
    userController.uploadDocuments )

router.delete("/", userController.deleteUsers)

export default router
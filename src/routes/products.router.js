import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", authorization("ADMIN"), productController.getProducts)

router.get("/:Pid", productController.getProduct)

router.post("/", authorization(["ADMIN", "premium"]), productController.addProduct)

router.put("/:Pid",authorization("ADMIN"), productController.updateProduct)

router.delete("/:Pid", authorization(["ADMIN", "premium"]), productController.deleteProduct)

export default router


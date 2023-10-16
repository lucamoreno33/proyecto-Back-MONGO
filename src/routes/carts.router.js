import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authorization("ADMIN"),cartController.getCarts)

router.get("/:cid", authorization(["user", "premium", "ADMIN"]), cartController.getCart)

router.post("/", authorization(["user", "premium", "ADMIN"]), cartController.addCart)

router.post("/:cid/products/:pid", authorization(["user", "premium", "ADMIN"]), cartController.addProductToCart)

router.delete("/:cid", authorization(["user", "premium", "ADMIN"]), cartController.emptyCart)

router.delete("/:cid/products/:pid", authorization(["user", "premium", "ADMIN"]), cartController.deleteProductOfThecart)

router.put("/:cid", router.put("/:cid", authorization(["ADMIN"]), cartController.updateCart), cartController.updateCart)

router.put("/:cid/purchase", authorization(["user", "premium", "ADMIN"]), cartController.purchaseCart)

export default router
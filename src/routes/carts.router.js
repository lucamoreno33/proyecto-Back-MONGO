import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authorization("ADMIN"),cartController.getCarts)

router.get("/:cid", authorization("user"), cartController.getCart)

router.post("/", authorization("user"), cartController.addCart)

router.post("/:cid/products/:pid", authorization("user"), cartController.addProductToCart)

router.delete("/:cid", authorization("user"), cartController.emptyCart)

router.delete("/:cid/products/:pid", authorization("user"), cartController.deleteProductOfThecart)

router.put("/:cid", router.put("/:cid", authorization("user"), cartController.updateCart), cartController.updateCart)

router.put("/:cid/purchase", cartController.purchaseCart)

export default router
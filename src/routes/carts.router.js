import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authorization("ADMIN"),cartController.getCarts)

router.get("/:cid", cartController.getCart)

router.post("/", authorization("ADMIN"), cartController.addCart)

router.post("/:cid/products/:pid", cartController.addProductToCart)

router.delete("/:cid", authorization("user"), cartController.emptyCart)

router.delete("/:cid/products/:pid", authorization("user"), cartController.deleteProductOfThecart)

router.put("/:cid", cartController.updateCart)

router.put("/:cid/purchase", cartController.purchaseCart)

export default router
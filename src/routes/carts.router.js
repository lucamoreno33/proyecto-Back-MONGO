import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.get("/", cartController.getCarts)

router.get("/:cid", cartController.getCart)

router.post("/", cartController.addCart)

router.post("/:cid/products/:pid", cartController.addProductToCart)

router.delete("/:cid", cartController.emptyCart)

router.delete("/:cid/products/:pid", cartController.deleteProductOfThecart)

router.put("/:cid", cartController.updateCart)


export default router
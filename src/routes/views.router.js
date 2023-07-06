import { Router } from "express";
import productManager from "../dao/mongo/manager/productManager.js";

const router = Router();
const productsManager = new productManager();

router.get("/", async (req, res) => {
    const products = await productsManager.getProducts();
    res.render("home", {products})
})




export default router;
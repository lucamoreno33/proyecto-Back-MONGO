import { Router } from "express";
import cartManager from "../dao/mongo/manager/cartManager.js";
import productManager from "../dao/mongo/manager/productManager.js"

const router = Router();
const cartsManager = new cartManager();
const productsManager = new productManager();

router.get("/", async (req, res) => {
    const carts = await cartsManager.getCarts()
    res.status(200).json({ status: "ok", data: carts })
})

router.post("/", async (req, res) => {
    const createdCart = await cartsManager.addCart()
    res.status(201).json({ status: "ok", data: createdCart })
})

router.post("/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params
    const product = await productsManager.getProduct(pid)
    await cartsManager.addProductToCart(cid, product)
    res.json("producto agregado exitosamente")

})

export default router
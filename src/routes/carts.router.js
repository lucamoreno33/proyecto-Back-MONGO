import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import authorization from "../middlewares/authorization.middlewares.js";


const router = Router();
const cartsManager = new cartController();


router.get("/",authorization("ADMIN"), async (req, res) => {
    const carts = await cartsManager.getCarts()
    res.status(200).json({ status: "ok", data: carts })
})

router.get("/:cid", authorization("user"), async (req, res) => {
    const { cid } = req.params;
    let cart = await cartsManager.getCart(cid).populate("products.product")
    res.status(200).json({ status: "ok", data: cart })
})

router.post("/", authorization("user"), async (req, res) => {
    const createdCart = await cartsManager.addCart()
    res.status(201).json({ status: "ok", data: createdCart })
})

router.post("/:cid/products/:pid",authorization("user"), async (req, res) => {
    const {cid, pid} = req.params
    let cart = await cartsManager.getCart(cid)
    cart.products.push({ product: pid })
    await cartsManager.addProductToCart(cid, cart)
    res.json("producto agregado exitosamente")
})

router.delete("/:cid", authorization("user"),async (req, res) =>{
    const {cid} = req.params;
    const result = await cartsManager.updateCart(cid, [])
    if (result){
        res.json("carro vaciado")
        return
    }
    res.status(404).json("carro no encontrado")
    
})

router.delete("/:cid/products/:pid", async (req, res) =>{
    const {cid, pid} = req.params
    
    const result = await cartsManager.deleteProductOfThecart(cid, pid)
    if (result){
        res.json("producto eliminado del carrito")
        return
    }
    res.status(400).json("el id del carro y/o del producto es incorrecto")
})

router.put("/:cid", async (req, res) =>{
    const {cid} = req.params;
    const newProducts = req.body;
    const result = await cartsManager.updateCart(cid, newProducts)
    if (result){
        res.json("carro actualizado")
        return
    }
    res.status(404).json("carro no encontrado")
    
})


export default router
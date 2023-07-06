import { Router } from "express";
import productManager from "../dao/mongo/manager/productManager.js";

const router = Router();
const productsManager = new productManager();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    let products;
    if (limit){
        console.log(limit)
        products = await productsManager.getProducts(limit);
    } else {
        products = await productsManager.getProducts(10);
    }

    res.status(200).json({ status: "ok", data: products});
})

router.get("/:Pid", async (req, res) =>{
    const { Pid } = req.params;
    const product = await productsManager.getProduct(Pid);
    if (product) return res.status(200).json(product)
    res.status(404).json({error: "id no encontrado"})
})

router.post("/", async (req, res) => {
    const {title, description, thumbnails, price, stock, code, status} = req.body
    if (!title || !description || !thumbnails || !price || !stock || !code || !status){
        return res.status(400).json({ status: "error", message: "no data sent!" })
    }
    const product = req.body;
    const createdProduct = await productsManager.addProduct(product)
    res.status(201).json({ status: "Ok", data: createdProduct})
})

router.put("/:Pid", async (req, res) => {
    const {title, description, thumbnails, price, stock, code, status} = req.body
    if (!title || !description || !thumbnails || !price || !stock || !code || !status){
        return res.status(400).json({ status: "error", message: "no data sent!" })
    } 
    const { Pid } = req.params;
    const newProduct = req.body;
    await productsManager.updateProduct(Pid, newProduct);
    res.json({ status: "ok", data: newProduct})
})

router.delete("/:Pid", async (req, res) =>{
    const { Pid } = req.params;
    await productsManager.deleteProduct(Pid);
    res.sendStatus(204);
})
export default router
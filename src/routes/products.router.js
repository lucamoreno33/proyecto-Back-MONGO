import { Router } from "express";
import productManager from "../dao/mongo/manager/productManager.js";
import authorization from "../middlewares/authorization.middlewares.js";


const router = Router();
const productsManager = new productManager();

router.get("/" ,authorization("user"), async (req, res) => {
        let { limit, page, sort, query, statusQuery} = req.query;
        if (sort == "asc"){
            sort = 1;
        } else if(sort == "desc"){
            sort = -1
        }
        const request = await productsManager.getProducts( limit, query, sort, statusQuery)
        res.status(200).json({ status: "ok", data: request});
    
})

router.get("/:Pid", authorization("ADMIN"), async (req, res) =>{
    const { Pid } = req.params;
    const product = await productsManager.getProduct(Pid);
    if (product) return res.status(200).json(product)
    res.status(404).json({error: "id no encontrado"})
})

router.post("/", authorization("ADMIN"), async (req, res) => {
    const {title, description, thumbnails, price, stock, code, status, brand} = req.body
    if (!title || !description || !thumbnails || !price || !brand || !stock || !code || !status){
        return res.status(400).json({ status: "error", message: "no data sent!" })
    }
    const product = req.body;
    const createdProduct = await productsManager.addProduct(product)
    res.status(201).json({ status: "Ok", data: createdProduct})
})

router.put("/:Pid", authorization("ADMIN"), async (req, res) => {
    const {title, description, thumbnails, price, stock, code, status, brand} = req.body
    if (!title || !description || !thumbnails || !price || !brand || !stock || !code || !status){
        return res.status(400).json({ status: "error", message: "no data sent!" })
    } 
    const { Pid } = req.params;
    const newProduct = req.body;
    await productsManager.updateProduct(Pid, newProduct);
    res.json({ status: "ok", data: newProduct})
})

router.delete("/:Pid", authorization("ADMIN"), async (req, res) =>{
    const { Pid } = req.params;
    await productsManager.deleteProduct(Pid);
    res.sendStatus(204);
})
export default router
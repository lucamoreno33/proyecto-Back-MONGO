import productManager from "../dao/mongo/product.mongo.js";

const productController = new productManager();

const getProduct = async(req, res) =>{
        const { Pid } = req.params;
        const result = await productController.getProduct(Pid)
        if (result) return res.status(200).json({status: "ok", data: result});
        return res.status(404).json({ message: "product not found"})
    }

const getProducts = async(req, res) => {
        let { limit, page, sort, query, statusQuery} = req.query;
        if (sort == "asc"){
            sort = 1;
        } else if(sort == "desc"){
            sort = -1
        }
        const request = await productController.getProducts(limit, query, sort, statusQuery)
        if (request) return res.status(200).json({ status: "ok", data: request});
        
        return res.status(400).json({status: "error", message: "bad request"})
    }


const addProduct = async(req, res) =>{
        const {title, description, thumbnails, price, stock, code, status, brand} = req.body
        if (!title || !description || !thumbnails || !price || !brand || !stock || !code || !status){
            return res.status(400).json({ status: "error", message: "no data sent!" })
        }
        const product = req.body;
        const createdProduct = await productController.addProduct(product)
        if (createdProduct) return res.status(201).json({ status: "Ok", data: createdProduct})

        return res.status(400).json({status: "error", message: "bad request" })
    } 


const updateProduct = async(req, res) =>{
        const {title, description, thumbnails, price, stock, code, status, brand} = req.body
        if (!title || !description || !thumbnails || !price || !brand || !stock || !code || !status){
            return res.status(400).json({ status: "error", message: "no data sent!" })
        } 
        const { Pid } = req.params;
        const newProduct = req.body;
        const result = await productController.updateProduct(Pid, newProduct);
        if (result) return res.json({ status: "ok", data: newProduct})

        return res.status(400).json({ status: "error", message: "bad request" })
    }


const deleteProduct = async(req, res) =>{
        const { Pid } = req.params;
        const result = await productController.deleteProduct(Pid);
        if (result) return res.sendStatus(204);
        
        return res.status(400).json({status: "error", message: "bad request"})
    }

export default{
    getProduct,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
}
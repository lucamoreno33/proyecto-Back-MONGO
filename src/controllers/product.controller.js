import productManager from "../dao/mongo/product.mongo.js";
import CustomErrors from "../utils/errors/Custom.errors.js";
import generateProductErrorInfo from "../utils/errors/info.errors.js";
import EnumErrors from "../utils/errors/Enum.errors.js";
import { generateProduct } from "../dao/Mocks/products.Mock.js";
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
        
        CustomErrors.createError({
            name: "database error",
            cause: "database internal error",    
            message: "error geting products",
            code: EnumErrors.DATABASE_ERROR
        })
        // return res.status(400).json({status: "error", message: "bad request"})
    }


const addProduct = async(req, res) =>{
        const {title, description, thumbnails, price, stock, code, status, brand} = req.body
        if (!title || !description || !thumbnails || !price || !brand || !stock || !code || !status){
            CustomErrors.createError({
                name: "product creation error",
                cause: generateProductErrorInfo({title, description, price, brand, code, stock, status, thumbnails}),
                message: "Error triying to add product",
                code: EnumErrors.INVALID_TYPES_ERROR,
            })
            // return res.status(400).json({ status: "error", message: "no data sent!" })
        }
        const product = req.body;
        const createdProduct = await productController.addProduct(product)
        if (createdProduct) {
            req.logger.info("producto creado")
            return res.status(201).json({ status: "Ok", data: createdProduct})
        }
        return res.status(400).json({status: "error", message: "bad request" })
    } 


const updateProduct = async(req, res) =>{
        const {title, description, thumbnails, price, stock, code, status, brand} = req.body
        if (!title || !description || !thumbnails || !price || !brand || !stock || !code || !status){
            CustomErrors.createError({
                name: "product creation error",
                cause: generateProductErrorInfo({title, description, price, brand, code, stock, status, thumbnails}),
                message: "Error triying to update product",
                code: EnumErrors.INVALID_TYPES_ERROR,
            })
            // return res.status(400).json({ status: "error", message: "no data sent!" })
        } 
        const { Pid } = req.params;
        const newProduct = req.body;
        if (Pid) {
            const result = await productController.updateProduct(Pid, newProduct);
            if (result) return res.json({ status: "ok", data: newProduct});

            CustomErrors.createError({
                name: "database error",
                cause: "database internal error",    
                message: "error updating product",
                code: EnumErrors.DATABASE_ERROR
            })
        }
        return res.status(400).json({ status: "error", message: "bad request" })
    }


const deleteProduct = async(req, res) =>{
    const { Pid } = req.params;
    if (Pid){
        const result = await productController.deleteProduct(Pid);
        if (result) {
            req.logger.warning("producto borrado de la db")
            return res.sendStatus(204);}

        CustomErrors.createError({
            name: "database error",
            cause: "database internal error",    
            message: "error deleting product",
            code: EnumErrors.DATABASE_ERROR
        })
    }
    return res.status(400).json({status: "error", message: "bad request"})
}

const create100Products = async (req, res) =>{
    const products = []
    for (let i = 0; i < 100; i++) {
        const product = await productController.addProduct(generateProduct())
        products.push(product)
    }
    res.send(products)
    
}

export default{
    getProduct,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    create100Products
}